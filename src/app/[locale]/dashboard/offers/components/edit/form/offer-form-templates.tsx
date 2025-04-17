import { ArrowUpRight } from 'lucide-react';
import { Templates } from '@/lib/templates';
import { Offer } from '@/types/offers';

export default function OfferFormTemplates({
  setTemplateValues,
}: {
  setTemplateValues: (value: Partial<Offer>) => void;
}) {
  const myTemplates = Templates;
  return (
    <div className="flex flex-col items-start justify-center gap-2 self-stretch px-6 pb-6">
      <ul className="inline-flex flex-col items-start justify-center gap-2 self-stretch">
        {myTemplates.map((item, index) => (
          <li
            onClick={() => {
              setTemplateValues(item.values);
            }}
            key={index}
            className="inline-flex items-start justify-start gap-2 self-stretch rounded-lg p-3 outline outline-offset-[-1px] outline-slate-500"
          >
            <div className="flex flex-1 items-center justify-start gap-2 self-stretch">
              <div className="text-Foreground-default flex-1 justify-start text-sm leading-tight font-medium">
                {item.name}
              </div>
            </div>
            <div className="">
              <ArrowUpRight className="h-6 w-6 stroke-zinc-950" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
