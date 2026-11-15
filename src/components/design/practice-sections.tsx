import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/lib/type";
import {
  consultationModeLabel,
  formatPrice,
  hasPracticeContent,
  isPractitioner,
} from "@/lib/profession";

const chipClass =
  "bg-slate-100/40 font-medium hover:bg-slate-200 text-blue-950/95 text-xs shadow-none rounded-xl px-3.5 py-1.5";

/**
 * Portfolio blocks for service professionals: practice details, services,
 * credentials and FAQs. Renders nothing for developer/designer profiles or
 * when the practice is empty, so existing portfolios are unchanged.
 */
export default function PracticeSections({ user }: { user: UserProfile }) {
  const practice = user.practice;
  if (!isPractitioner(user) || !practice || !hasPracticeContent(practice)) {
    return null;
  }

  const services = (practice.services || []).filter((s) => s.name?.trim());
  const credentials = (practice.credentials || []).filter((c) => c.trim());
  const specialities = (practice.specialities || []).filter((c) => c.trim());
  const modes = practice.consultationModes || [];
  const faqs = (practice.faqs || []).filter(
    (f) => f.question?.trim() && f.answer?.trim()
  );
  const hasDetails =
    practice.name?.trim() ||
    practice.address?.trim() ||
    practice.serviceArea?.trim() ||
    practice.registrationNumber?.trim() ||
    modes.length > 0;

  return (
    <>
      {hasDetails && (
        <section id="practice" className="px-6 pt-6">
          <div className="rounded-xl border p-4 text-sm space-y-1.5">
            {practice.name && (
              <p className="font-semibold text-base">{practice.name}</p>
            )}
            {modes.length > 0 && (
              <p className="text-slate-600">
                {modes.map(consultationModeLabel).join(" · ")}
              </p>
            )}
            {practice.serviceArea && (
              <p className="text-slate-600">{practice.serviceArea}</p>
            )}
            {practice.address && (
              <p className="text-slate-600">{practice.address}</p>
            )}
            {practice.registrationNumber && (
              <p className="text-slate-500 text-xs">
                Registration no. {practice.registrationNumber}
              </p>
            )}
          </div>
        </section>
      )}

      {(specialities.length > 0 || credentials.length > 0) && (
        <section id="specialities" className="flex flex-col gap-4 px-6 pt-6">
          {specialities.length > 0 && (
            <div>
              <p className="font-medium text-sm text-slate-600">
                Areas I help with
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {specialities.map((s) => (
                  <Badge className={chipClass} key={s}>
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {credentials.length > 0 && (
            <div>
              <p className="font-medium text-sm text-slate-600">Credentials</p>
              <ul className="mt-2 space-y-1 text-sm">
                {credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {services.length > 0 && (
        <section id="services" className="p-6">
          <div className="flex min-h-0 flex-col gap-y-3">
            <h2 className="text-lg font-semibold">Services</h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service, i) => {
                const price = formatPrice(service.price, service.currency);
                return (
                  <div
                    key={`${service.name}-${i}`}
                    className="rounded-xl border p-4 flex flex-col gap-2"
                  >
                    <div className="flex justify-between gap-3 items-start">
                      <h3 className="font-medium text-sm">{service.name}</h3>
                      {price && (
                        <span className="text-sm font-semibold whitespace-nowrap">
                          {price}
                        </span>
                      )}
                    </div>
                    {service.duration && (
                      <p className="text-xs text-slate-500">
                        {service.duration}
                      </p>
                    )}
                    {service.description && (
                      <p className="text-sm font-light">
                        {service.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section id="faq" className="p-6">
          <div className="flex min-h-0 flex-col gap-y-3">
            <h2 className="text-lg font-semibold">Frequently asked questions</h2>
            <div className="mt-2 divide-y border rounded-xl">
              {faqs.map((faq, i) => (
                <details key={i} className="group p-4">
                  <summary className="cursor-pointer list-none flex justify-between gap-4 text-sm font-medium">
                    {faq.question}
                    <span className="text-slate-400 group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-sm font-light whitespace-pre-line">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
