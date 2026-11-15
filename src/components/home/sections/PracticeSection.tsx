"use client";

import React, { useState } from "react";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import type {
  ConsultationMode,
  Faq,
  Practice,
  Profession,
  Service,
  UserProfile,
} from "@/lib/type";
import {
  CONSULTATION_MODES,
  PROFESSIONS,
  getProfession,
  isPractitioner,
} from "@/lib/profession";
import { SortableList, SortableItem, GripIcon } from "../Sortable";

type Props = {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  markAsEdited: () => void;
};

const inputClassNames = { inputWrapper: "border-1 shadow-none" };
const rowClass =
  "flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start";

const emptyService: Service = {
  name: "",
  description: "",
  duration: "",
  price: "",
  currency: "",
};
const emptyFaq: Faq = { question: "", answer: "" };

/** Default currency for new services, from the profile's country. */
function defaultCurrency(user: UserProfile): string {
  const cc = (user.basics.location?.countryCode || "").toUpperCase();
  return cc === "IN" || cc === "IND" ? "INR" : "USD";
}

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Enter-to-add list of short strings, shown as removable chips. */
function TagInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft("");
  };
  return (
    <div className="max-w-xs w-full flex flex-col gap-2">
      <Input
        type="text"
        variant="bordered"
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        className="text-gray-600"
        classNames={inputClassNames}
      />
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {values.map((v) => (
            <Chip
              key={v}
              variant="flat"
              onClose={() => onChange(values.filter((x) => x !== v))}
            >
              {v}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}

function DeleteButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button onClick={onClick} aria-label={label}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 text-red-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </button>
  );
}

function AddButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="bordered"
      onClick={onClick}
      className="border bg-none flex justify-center items-center gap-1 text-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5 text-gray-700"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      {children}
    </Button>
  );
}

/**
 * Editor for the person's profession and, for service professionals, their
 * practice: details, services, credentials, specialities and FAQs. Writes to
 * `meta.profession` and `practice` on the UserProfile.
 */
export default function PracticeSection({ user, setUser, markAsEdited }: Props) {
  const profession = getProfession(user);
  const practice: Practice = user.practice || {};
  const services = practice.services || [];
  const faqs = practice.faqs || [];

  const setProfession = (value: Profession) => {
    setUser((prev) => ({ ...prev, meta: { ...prev.meta, profession: value } }));
    markAsEdited();
  };

  const updatePractice = (patch: Partial<Practice>) => {
    setUser((prev) => ({ ...prev, practice: { ...(prev.practice || {}), ...patch } }));
    markAsEdited();
  };

  const updateService = (index: number, patch: Partial<Service>) =>
    updatePractice({
      services: services.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    });

  const updateFaq = (index: number, patch: Partial<Faq>) =>
    updatePractice({
      faqs: faqs.map((f, i) => (i === index ? { ...f, ...patch } : f)),
    });

  const textField = (
    label: string,
    key: "name" | "registrationNumber" | "bookingUrl" | "serviceArea" | "address",
    placeholder?: string
  ) => (
    <div className={rowClass}>
      <p className="pt-.05">{label}</p>
      <Input
        type={key === "bookingUrl" ? "url" : "text"}
        variant="bordered"
        value={practice[key] || ""}
        placeholder={placeholder}
        onChange={(e) => updatePractice({ [key]: e.target.value })}
        className="max-w-xs text-gray-600"
        classNames={inputClassNames}
      />
    </div>
  );

  return (
    <div
      id="practice"
      className="flex flex-col pt-11 justify-center items-start gap-4"
    >
      <h2 className="font-semibold text-lg mb-4">Profession & practice</h2>
      <div className={rowClass}>
        <p className="pt-.05">Profession</p>
        <Select
          aria-label="Profession"
          variant="bordered"
          selectedKeys={[profession]}
          onChange={(e) => {
            if (e.target.value) setProfession(e.target.value as Profession);
          }}
          className="max-w-xs text-gray-600"
          classNames={{ trigger: "border-1 shadow-none" }}
        >
          {PROFESSIONS.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      {!isPractitioner(user) ? (
        <p className="text-sm text-slate-500">
          Pick a service profession (dietician, therapist, lawyer...) to add
          your practice, services, fees and FAQs to your page.
        </p>
      ) : (
        <>
          {textField("Practice name", "name", "e.g. Nourish Nutrition Clinic")}
          {textField("Registration no.", "registrationNumber", "Licence or council number")}
          {textField("Booking link", "bookingUrl", "https://cal.com/you")}
          {textField("Area served", "serviceArea", "e.g. Online across India")}
          {textField("Clinic address", "address")}

          <div className={rowClass}>
            <p className="pt-.05">Consultations</p>
            <CheckboxGroup
              aria-label="Consultation modes"
              orientation="horizontal"
              value={practice.consultationModes || []}
              onChange={(value) =>
                updatePractice({ consultationModes: value as ConsultationMode[] })
              }
              className="max-w-xs w-full"
            >
              {CONSULTATION_MODES.map((m) => (
                <Checkbox key={m.value} value={m.value} size="sm">
                  {m.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>

          <div className={rowClass}>
            <p className="pt-.05">Credentials</p>
            <TagInput
              values={practice.credentials || []}
              onChange={(credentials) => updatePractice({ credentials })}
              placeholder="e.g. Registered Dietitian, press Enter"
            />
          </div>

          <div className={rowClass}>
            <p className="pt-.05">Areas you help with</p>
            <TagInput
              values={practice.specialities || []}
              onChange={(specialities) => updatePractice({ specialities })}
              placeholder="e.g. PCOS, diabetes, press Enter"
            />
          </div>

          <h3 className="font-semibold text-base mt-6">Services</h3>
          <SortableList
            ids={services.map((_, i) => String(i))}
            onReorder={(from, to) => updatePractice({ services: move(services, from, to) })}
          >
            <div className="flex flex-col w-full gap-4">
              {services.map((service, index) => (
                <SortableItem key={index} id={String(index)}>
                  {({ setNodeRef, style, attributes, listeners }) => (
                    <div
                      ref={setNodeRef}
                      style={style}
                      className="flex flex-col w-full gap-4 border rounded-xl p-5 bg-white"
                    >
                      <div className="w-full flex justify-between">
                        <button
                          {...attributes}
                          {...listeners}
                          aria-label={`Reorder service ${index + 1}`}
                          className="cursor-grab text-slate-400"
                        >
                          <GripIcon />
                        </button>
                        <DeleteButton
                          label={`Delete service ${index + 1}`}
                          onClick={() =>
                            updatePractice({
                              services: services.filter((_, i) => i !== index),
                            })
                          }
                        />
                      </div>
                      <div className={rowClass}>
                        <p className="pt-.05">Service</p>
                        <Input
                          variant="bordered"
                          value={service.name}
                          placeholder="e.g. Initial consultation"
                          onChange={(e) => updateService(index, { name: e.target.value })}
                          className="max-w-xs text-gray-600"
                          classNames={inputClassNames}
                        />
                      </div>
                      <div className={rowClass}>
                        <p className="pt-.05">Duration</p>
                        <Input
                          variant="bordered"
                          value={service.duration || ""}
                          placeholder="e.g. 45 min"
                          onChange={(e) => updateService(index, { duration: e.target.value })}
                          className="max-w-xs text-gray-600"
                          classNames={inputClassNames}
                        />
                      </div>
                      <div className={rowClass}>
                        <p className="pt-.05">Price</p>
                        <div className="max-w-xs w-full flex gap-2">
                          <Input
                            variant="bordered"
                            value={service.price || ""}
                            placeholder="e.g. 1500"
                            onChange={(e) => updateService(index, { price: e.target.value })}
                            className="text-gray-600"
                            classNames={inputClassNames}
                          />
                          <Select
                            aria-label="Currency"
                            variant="bordered"
                            selectedKeys={[service.currency || defaultCurrency(user)]}
                            onChange={(e) => {
                              if (e.target.value)
                                updateService(index, { currency: e.target.value });
                            }}
                            className="w-28"
                            classNames={{ trigger: "border-1 shadow-none" }}
                          >
                            {["INR", "USD", "GBP", "EUR", "AED"].map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                      </div>
                      <div className={rowClass}>
                        <p className="pt-.05">Description</p>
                        <Textarea
                          variant="bordered"
                          value={service.description}
                          onChange={(e) =>
                            updateService(index, { description: e.target.value })
                          }
                          className="max-w-xs text-gray-600"
                          classNames={inputClassNames}
                        />
                      </div>
                    </div>
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableList>
          <AddButton
            onClick={() =>
              updatePractice({
                services: [...services, { ...emptyService, currency: defaultCurrency(user) }],
              })
            }
          >
            Add Service
          </AddButton>

          <h3 className="font-semibold text-base mt-6">FAQs</h3>
          <p className="text-sm text-slate-500 -mt-2">
            Answer what clients ask before booking. These also help AI search
            engines describe you correctly.
          </p>
          <SortableList
            ids={faqs.map((_, i) => String(i))}
            onReorder={(from, to) => updatePractice({ faqs: move(faqs, from, to) })}
          >
            <div className="flex flex-col w-full gap-4">
              {faqs.map((faq, index) => (
                <SortableItem key={index} id={String(index)}>
                  {({ setNodeRef, style, attributes, listeners }) => (
                    <div
                      ref={setNodeRef}
                      style={style}
                      className="flex flex-col w-full gap-4 border rounded-xl p-5 bg-white"
                    >
                      <div className="w-full flex justify-between">
                        <button
                          {...attributes}
                          {...listeners}
                          aria-label={`Reorder FAQ ${index + 1}`}
                          className="cursor-grab text-slate-400"
                        >
                          <GripIcon />
                        </button>
                        <DeleteButton
                          label={`Delete FAQ ${index + 1}`}
                          onClick={() =>
                            updatePractice({ faqs: faqs.filter((_, i) => i !== index) })
                          }
                        />
                      </div>
                      <div className={rowClass}>
                        <p className="pt-.05">Question</p>
                        <Input
                          variant="bordered"
                          value={faq.question}
                          placeholder="e.g. Do you offer online consultations?"
                          onChange={(e) => updateFaq(index, { question: e.target.value })}
                          className="max-w-xs text-gray-600"
                          classNames={inputClassNames}
                        />
                      </div>
                      <div className={rowClass}>
                        <p className="pt-.05">Answer</p>
                        <Textarea
                          variant="bordered"
                          value={faq.answer}
                          onChange={(e) => updateFaq(index, { answer: e.target.value })}
                          className="max-w-xs text-gray-600"
                          classNames={inputClassNames}
                        />
                      </div>
                    </div>
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableList>
          <AddButton onClick={() => updatePractice({ faqs: [...faqs, { ...emptyFaq }] })}>
            Add FAQ
          </AddButton>
        </>
      )}
    </div>
  );
}
