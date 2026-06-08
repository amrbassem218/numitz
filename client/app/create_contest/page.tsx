"use client";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import MathNoise from "@/components/ui/MathNoise";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import ProblemCard from "./problemCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus } from "lucide-react";
import { getFormattedDate, HEADER_MARGIN } from "@/lib/utils";
import DatePicker from "@/components/ui/date_picker";
import TimePicker from "@/components/ui/timePicker";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "../hooks/useUser";
import { supabase } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const problemSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable(),
    submission_count: z.number().nullable(),
    correct_submission_count: z.number().nullable(),
    points: z.number().nullable(),
    difficulty: z
      .number()
      .int("Difficulty must be a whole number")
      .min(0, "Difficulty cannot be negative")
      .max(10000, "Difficulty is too high")
      .nullable(),
    likes: z.number().nullable(),
    comments_num: z.number().nullable(),
    tags: z.array(z.string()).nullable(),
    description_latex: z.string().nullable(),
    description_html: z.string().nullable(),
    answer: z.string().nullable(),
    editorial: z.string(),
    index_in_contest: z.number(),
  })
  .superRefine((problem, ctx) => {
    if (!problem.name?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Problem name is required",
        path: ["name"],
      });
    }

    if (!problem.description_latex?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Problem latex is required",
        path: ["description_latex"],
      });
    }

    if (problem.difficulty === null) {
      ctx.addIssue({
        code: "custom",
        message: "Difficulty is required",
        path: ["difficulty"],
      });
    }

    if (problem.points === null) {
      ctx.addIssue({
        code: "custom",
        message: "Points are required",
        path: ["points"],
      });
    }

    if (!problem.editorial.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Editorial is required",
        path: ["editorial"],
      });
    }
  });

const problemsSchema = z
  .array(problemSchema)
  .min(1, "Contest must have at least one problem");

type Props = Record<string, never>;
const SIGN_IN_MESSAGE = "Please sign in to create a contest.";
const contestSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name should be at least 2 characters long")
      .max(100, "Name should be at most 100 characters long"),
    description: z
      .string()
      .min(2, "Description should be at least 2 characters long")
      .optional(),
    difficulty: z
      .number()
      .int("Difficulty must be a whole number")
      .min(0, "Difficulty cannot be negative")
      .max(10000, "Difficulty is too high"),
    mode: z.enum(["practice", "live"]),
    status: z.enum(["public", "private"]),
    start_date: z.date(),
    start_time: z.string(),

    end_date: z.date(),
    end_time: z.string(),
    problems: problemsSchema,
  })
  .refine(
    (data) =>
      combineDateAndTime(data.end_date, data.end_time).getTime() >
      combineDateAndTime(data.start_date, data.start_time).getTime(),
    {
      message: "End date and time must be after the start date and time",
      path: ["end_time"],
    },
  );

export type CreateContestFormValues = z.infer<typeof contestSchema>;

function combineDateAndTime(date: Date, time: string) {
  const [hours = "0", minutes = "0", seconds = "0"] = time.split(":");
  const result = new Date(date);

  result.setHours(Number(hours), Number(minutes), Number(seconds), 0);
  return result;
}

const CreateContest = ({}: Props) => {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const form = useForm<CreateContestFormValues>({
    resolver: zodResolver(contestSchema),
    defaultValues: {
      name: "",
      description: "",
      difficulty: 800,
      mode: "practice",
      status: "public",
      start_date: new Date(),
      start_time: getFormattedDate(new Date()).timeFull,

      end_date: new Date(),
      end_time: getFormattedDate(new Date()).timeFull,
      problems: [],
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "problems",
  });

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace("/sign_in");
    }
  }, [router, user, userLoading]);

  const onSubmit = async (data: CreateContestFormValues) => {
    const {
      data: { user: signedInUser },
    } = await supabase.auth.getUser();

    if (!signedInUser) {
      toast.error(SIGN_IN_MESSAGE);
      router.push("/sign_in");
      return;
    }

    const startAt = combineDateAndTime(data.start_date, data.start_time);
    const endAt = combineDateAndTime(data.end_date, data.end_time);
    const contestData = {
      ...data,
      start_date: startAt.toISOString(),
      end_date: endAt.toISOString(),
      length_in_minutes: Math.round(
        (endAt.getTime() - startAt.getTime()) / 60000,
      ),
      problems: data.problems.map((problem, index) => ({
        ...problem,
        index_in_contest: index,
      })),
    };

    try {
      form.clearErrors("root.server");
      await axios.post("/api/contests", contestData);
      toast.success("Contest created successfully!");
      form.reset();
    } catch (err) {
      const message = axios.isAxiosError<{ error?: string }>(err)
        ? err.response?.data?.error || "Failed to create contest"
        : "Failed to create contest";

      form.setError("root.server", {
        message,
      });
      toast.error(message);
    }
  };

  if (userLoading || !user) {
    return null;
  }

  const handleProblemDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return;

    const sourceId = event.operation.source?.id;
    const targetId = event.operation.target?.id;
    if (!sourceId || !targetId || sourceId === targetId) return;

    const sourceIndex = fields.findIndex((field) => field.id === sourceId);
    const targetIndex = fields.findIndex((field) => field.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    move(sourceIndex, targetIndex);
  };

  return (
    <main
      className="relative flex justify-center items-center max-w-[1444]! px-0 "
      style={{ height: `calc(100vh - ${HEADER_MARGIN}px)` }}
    >
      <section className="z-10 w-full lg:w-2/4 px-5 md:px-10 max-w-4xl my-auto space-y-4">
        {/* Heading */}
        <div>
          <h3 className="text-text">Create your contest</h3>
          <p className="text-text-muted">By the community, for the community</p>
        </div>

        <form
          className="max-w-2xl mx-auto flex flex-col gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Contest Name</FieldLabel>
                <Input {...field} id="name" placeholder="Algebra Blitz 201" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">
                  Description{" "}
                  <span className="text-sm text-muted-foreground">
                    (optional)
                  </span>
                </FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  placeholder="The greatest competition to ever exist"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="difficulty"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="difficulty">Contest Difficulty</FieldLabel>
                <Input
                  {...field}
                  id="difficulty"
                  type="number"
                  min={0}
                  step={1}
                  placeholder="800"
                  value={field.value}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value ? Number(event.target.value) : 0,
                    )
                  }
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="mode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="mode">Contest Mode</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="mode" className="w-full">
                    <SelectValue placeholder="Select contest mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="practice">Practice</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="status">Contest Visibility</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <FieldGroup className="flex items-center gap-4">
            <FieldGroup className="flex items-center flex-row gap-2">
              <Controller
                name="start_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState?.invalid}>
                    <FieldLabel htmlFor="date-picker">Start Date</FieldLabel>

                    <DatePicker
                      initial_date={new Date()}
                      onChangeFunc={(date) => field.onChange(date)}
                    />
                    {fieldState?.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="start_time"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState?.invalid}>
                    <FieldLabel htmlFor="date-picker">Start Time</FieldLabel>

                    <TimePicker onChangeFunc={(time) => field.onChange(time)} />

                    {fieldState?.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup className="flex items-center flex-row gap-2">
              <Controller
                name="end_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState?.invalid}>
                    <FieldLabel htmlFor="date-picker">End Date</FieldLabel>

                    <DatePicker
                      initial_date={new Date()}
                      onChangeFunc={(date) => field.onChange(date)}
                    />
                    {fieldState?.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="end_time"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState?.invalid}>
                    <FieldLabel htmlFor="date-picker">End Time</FieldLabel>

                    <TimePicker onChangeFunc={(time) => field.onChange(time)} />

                    {fieldState?.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldGroup>

          <Separator className="my-4" />
          <h4 className="text-text">Problems</h4>
          {form.formState.errors.problems?.message && (
            <p className="text-sm text-destructive">
              {form.formState.errors.problems.message}
            </p>
          )}

          <DragDropProvider onDragEnd={handleProblemDragEnd}>
            {fields.map((field, index) => (
              <ProblemCard
                key={field.id}
                fieldId={field.id}
                index={index}
                control={form.control}
                remove={remove}
              />
            ))}
          </DragDropProvider>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                name: null,
                submission_count: null,
                correct_submission_count: null,
                points: null,
                difficulty: null,
                likes: null,
                comments_num: null,
                tags: null,
                description_latex: null,
                description_html: null,
                answer: null,
                editorial: "",
                index_in_contest: fields.length,
              })
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Problem
          </Button>

          {form.formState.errors.root?.server && (
            <p className="text-sm text-destructive">
              {form.formState.errors.root.server.message}
            </p>
          )}

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            Submit
          </Button>
        </form>
      </section>
      <section className="h-full absolute w-full">
        <div className="relative w-full h-full  hidden lg:flex justify-center items-center bg-acc ent  overflow-hidden select-none">
          {/* Shadow layer */}
          <h1 className="absolute text-[150px] font-bold text-primary opacity-30 blur-3xl scale-110 flex flex-col items-center pointer-events-none ">
            <span>
              <span className="text-[170px]">N</span>UM
            </span>
            <span>ITZ</span>
          </h1>

          <MathNoise />
        </div>
      </section>
    </main>
  );
};

export default CreateContest;
