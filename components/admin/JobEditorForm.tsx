"use client";

import type { Job } from "@/data/jobs";
import { FormHeader, Input, SaveButton, Textarea } from "./AdminCmsUi";

type JobEditorFormProps = {
  value: Job;
  requirements: string;
  requirementsEn: string;
  isSaving: boolean;
  onChange: (value: Job) => void;
  onRequirementsChange: (value: string) => void;
  onRequirementsEnChange: (value: string) => void;
  onDelete?: () => void;
  onSave: () => void;
};

export default function JobEditorForm({
  value,
  requirements,
  requirementsEn,
  isSaving,
  onChange,
  onRequirementsChange,
  onRequirementsEnChange,
  onDelete,
  onSave,
}: JobEditorFormProps) {
  return (
    <div className="space-y-5">
      <FormHeader title="Tuyển dụng" onDelete={onDelete} />
      <Input label="Vị trí" value={value.title} onChange={(title) => onChange({ ...value, title })} />
      <Input label="Vị trí EN" value={value.titleEn} onChange={(titleEn) => onChange({ ...value, titleEn })} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input label="Địa điểm" value={value.location} onChange={(location) => onChange({ ...value, location })} />
        <Input label="Loại hình" value={value.type} onChange={(type) => onChange({ ...value, type })} />
        <Input label="Lương" value={value.salary} onChange={(salary) => onChange({ ...value, salary })} />
      </div>
      <Textarea label="Mô tả công việc" value={value.description} onChange={(description) => onChange({ ...value, description })} />
      <Textarea label="Mô tả EN" value={value.descriptionEn} onChange={(descriptionEn) => onChange({ ...value, descriptionEn })} />
      <Textarea label="Yêu cầu, mỗi dòng một ý" value={requirements} onChange={onRequirementsChange} />
      <Textarea label="Yêu cầu EN, mỗi dòng một ý" value={requirementsEn} onChange={onRequirementsEnChange} />
      <SaveButton disabled={isSaving} onClick={onSave} />
    </div>
  );
}
