import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

type Framework = {
  label: string;
  value: string;
};

const frameworks: Framework[] = [
  { label: "15", value: "15" },
  { label: "25", value: "25" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
];

export function ComboboxCustomItems({
  value,
  onSelect,
}: {
  value: number;
  onSelect: (val: number) => void;
}) {
  const selectedFramework = frameworks.find((f) => f.value === String(value));

  return (
    <Combobox
      items={frameworks}
      itemToStringValue={(framework: Framework) => framework.label}
      value={selectedFramework ?? null}
      onValueChange={(item) => item && onSelect(Number(item.value))}
    >
      <ComboboxInput
        placeholder={String(value)}
        className={"w-20 cursor-pointer"}
        readOnly
      />
      <ComboboxContent>
        <ComboboxList>
          {(framework) => (
            <ComboboxItem key={framework.value} value={framework}>
              {framework.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
