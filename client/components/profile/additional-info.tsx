import { MapPin, Users, Mail } from "lucide-react";

interface Props {
  country: string | null;
  mathClub: string | null;
  email: string | null;
}

const allItems = [
  { icon: MapPin, key: "country" as const, label: "Country" },
  { icon: Users, key: "mathClub" as const, label: "Math Club" },
  { icon: Mail, key: "email" as const, label: "Email" },
];

export function AdditionalInfo({ country, mathClub, email }: Props) {
  const items: Record<string, string | null> = { country, mathClub, email };
  const visible = allItems.filter(({ key }) => items[key]);

  if (visible.length === 0) return null;

  return (
    <div className="space-y-3">
      {visible.map(({ icon: Icon, key }) => (
        <div key={key} className="flex items-center gap-3 text-sm">
          <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">{items[key]}</span>
        </div>
      ))}
    </div>
  );
}
