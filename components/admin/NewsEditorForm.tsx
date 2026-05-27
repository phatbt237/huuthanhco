"use client";

import type { NewsItem } from "@/data/news";
import type { MediaRecord } from "@/lib/siteApi";
import { FormHeader, Input, SaveButton, Textarea } from "./AdminCmsUi";
import GalleryWithThumbnail from "./GalleryWithThumbnail";

type NewsEditorFormProps = {
  value: NewsItem;
  media: MediaRecord[];
  token: string;
  isSaving: boolean;
  onChange: (value: NewsItem) => void;
  onTitleChange: (title: string) => void;
  onSlugChange: (slug: string) => void;
  onUploaded: (item: MediaRecord) => void;
  onDelete?: () => void;
  onSave: () => void;
};

export default function NewsEditorForm({
  value,
  media,
  token,
  isSaving,
  onChange,
  onTitleChange,
  onSlugChange,
  onUploaded,
  onDelete,
  onSave,
}: NewsEditorFormProps) {
  return (
    <div className="space-y-5">
      <FormHeader title="Tin tức" onDelete={onDelete} />
      <Input label="Tiêu đề" value={value.title} onChange={onTitleChange} />
      <Input label="Tiêu đề EN" value={value.titleEn} onChange={(titleEn) => onChange({ ...value, titleEn })} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Input label="Slug" value={value.slug} onChange={onSlugChange} />
        <Input label="Ngày" type="date" value={value.date} onChange={(date) => onChange({ ...value, date })} />
        <Input label="Danh mục" value={value.category} onChange={(category) => onChange({ ...value, category })} />
        <Input label="Danh mục EN" value={value.categoryEn} onChange={(categoryEn) => onChange({ ...value, categoryEn })} />
      </div>
      <GalleryWithThumbnail
        label="Ảnh tin tức"
        images={value.galleryImages ?? []}
        thumbnail={value.thumbnail}
        media={media}
        token={token}
        folder="news"
        onImagesChange={(galleryImages) => onChange({ ...value, galleryImages })}
        onThumbnailChange={(thumbnail) => onChange({ ...value, thumbnail })}
        onUploaded={onUploaded}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Textarea label="Mô tả ngắn (VI)" value={value.excerpt} onChange={(excerpt) => onChange({ ...value, excerpt })} />
        <Textarea label="Mô tả ngắn (EN)" value={value.excerptEn} onChange={(excerptEn) => onChange({ ...value, excerptEn })} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Textarea label="Nội dung (VI)" rows={8} value={value.content} onChange={(content) => onChange({ ...value, content })} />
        <Textarea label="Nội dung (EN)" rows={8} value={value.contentEn} onChange={(contentEn) => onChange({ ...value, contentEn })} />
      </div>
      <SaveButton disabled={isSaving} onClick={onSave} />
    </div>
  );
}
