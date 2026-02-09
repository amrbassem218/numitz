"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
interface props {
  expressions: any;
  setExpressions: Dispatch<SetStateAction<any>>;
}
export default function GraphCalculator({
  expressions,
  setExpressions,
}: props) {
  const calculatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calculatorRef.current) return;

    const script = document.createElement("script");
    script.src = `${process.env.NEXT_PUBLIC_CALCULATOR_URL}?apiKey=${process.env.NEXT_PUBLIC_CALCULATOR_KEY}`;
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      const calculator = Desmos.GraphingCalculator(calculatorRef.current, {
        expressions: true,
        settingsMenu: true,
      });
      if (expressions) {
        calculator.setExpressions(expressions);
      }
      calculator.observe("expressions", () => {
        console.log("heyyy");
        setExpressions(calculator.getExpressions());
      });

      let prevExp: any = null;
      setInterval(() => {
        const curExp = calculator.getExpressions();
        console.log("prevExp:", prevExp);
        console.log("curExp: ", curExp);
        if (curExp != prevExp) {
          prevExp = curExp;
          setExpressions(prevExp);
        }
      }, 500);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    console.log("expressions: ", expressions);
  }, [expressions]);
  return (
    <div ref={calculatorRef} className="w-full h-full rounded-lg border" />
  );
}
