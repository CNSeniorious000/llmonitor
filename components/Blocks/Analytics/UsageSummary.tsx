import { formatCost, formatLargeNumber } from "@/utils/format"
import AnalyticsCard from "./AnalyticsCard"
import BarList from "./BarList"

export default function UsageSummary({ usage }) {
  console.log(usage)
  return (
    <AnalyticsCard title="LLM Usage">
      <BarList
        data={usage
          .filter((u) => u.type === "llm")
          .map((model) => ({
            value: model.name,
            tokens: model.completion_tokens + model.prompt_tokens,
            cost: model.cost,
            a: console.log(model),
            barSections: [
              {
                value: "Completion",
                tooltip: "Completion Tokens",
                count: model.completion_tokens,
                color: "var(--mantine-color-blue-4)",
              },
              {
                value: "Prompt",
                tooltip: "Prompt Tokens",
                count: model.prompt_tokens,
                color: "var(--mantine-color-cyan-3)",
              },
            ],
          }))}
        columns={[
          {
            name: "Model",
            bar: true,
          },
          {
            name: "Tokens",
            key: "tokens",
            main: true,
            render: formatLargeNumber,
          },
          {
            name: "Cost",
            key: "cost",
            render: formatCost,
          },
        ]}
      />
    </AnalyticsCard>
  )
}
