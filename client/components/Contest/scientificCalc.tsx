type Props = {};

export default function ScientificCalc({}: Props) {
  return (
    <>
      <div
        id="inch-calculator-icw"
        data-ct="scientific_calculator"
        data-cw="100%"
        data-ch="600"
        data-cv="MTE3NzA0NTkzODY="
      ></div>
      <script
        src="https://cdn.inchcalculator.com/e/widgets.min.js"
        async
        defer
      ></script>
    </>
  );
}
