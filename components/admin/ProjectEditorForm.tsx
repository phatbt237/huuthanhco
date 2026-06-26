"use client";

import type { Project } from "@/data/projects";
import type { MediaRecord } from "@/lib/siteApi";
import { FormHeader, Input, SaveButton, SelectField, Textarea } from "./AdminCmsUi";
import GalleryWithThumbnail from "./GalleryWithThumbnail";

const projectCategories = [
  { value: "Công trình giao thông hàng hải", valueEn: "Marine Transportation Works" },
  { value: "Công trình hạ tầng kỹ thuật", valueEn: "Technical Infrastructure Works" },
  { value: "Dịch vụ", valueEn: "Services" },
];

const projectLocations = [
  "Miền Bắc",
  "Miền Trung",
  "Miền Nam",
  "Toàn quốc",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cần Thơ",
  "Cao Bằng",
  "Đà Nẵng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Nội",
  "Hà Tĩnh",
  "Hải Dương",
  "Hải Phòng",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "TP. Hồ Chí Minh",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

type ProjectEditorFormProps = {
  value: Project;
  media: MediaRecord[];
  token: string;
  isSaving: boolean;
  onChange: (value: Project) => void;
  onUploaded: (item: MediaRecord) => void;
  onDelete?: () => void;
  onSave: () => void;
};

export default function ProjectEditorForm({
  value,
  media,
  token,
  isSaving,
  onChange,
  onUploaded,
  onDelete,
  onSave,
}: ProjectEditorFormProps) {
  return (
    <div className="space-y-5">
      <FormHeader title="Dự án" onDelete={onDelete} />
      <Input label="Tên dự án" value={value.name} onChange={(name) => onChange({ ...value, name })} />
      <Input label="Tên dự án EN" value={value.nameEn} onChange={(nameEn) => onChange({ ...value, nameEn })} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SelectField
          label="Địa điểm"
          value={value.location}
          onChange={(location) => onChange({ ...value, location })}
          options={projectLocations.map((location) => ({ value: location, label: location }))}
        />
        <Input label="Năm" type="number" value={String(value.year)} onChange={(year) => onChange({ ...value, year: Number(year) })} />
        <SelectField
          label="Loại"
          value={value.category}
          onChange={(category) => {
            const selected = projectCategories.find((item) => item.value === category);
            onChange({ ...value, category, categoryEn: selected?.valueEn ?? category });
          }}
          options={projectCategories.map((category) => ({ value: category.value, label: category.value }))}
        />
      </div>
      <GalleryWithThumbnail
        label="Ảnh dự án"
        images={value.galleryImages ?? []}
        thumbnail={value.image}
        media={media}
        token={token}
        folder="projects"
        onImagesChange={(galleryImages) => onChange({ ...value, galleryImages })}
        onThumbnailChange={(image) => onChange({ ...value, image })}
        onUploaded={onUploaded}
      />
      <Textarea label="Mô tả" value={value.description} onChange={(description) => onChange({ ...value, description })} />
      <Textarea label="Mô tả EN" value={value.descriptionEn} onChange={(descriptionEn) => onChange({ ...value, descriptionEn })} />
      <SaveButton disabled={isSaving} onClick={onSave} />
    </div>
  );
}
