import { useEffect, useState } from "react";

export default function BookForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    id: null, title: "", author: "", publisher: "", language: "", year: "", image: ""
  });

  useEffect(() => {
    if (initial) {
      setForm({
        id: initial.id ?? null,
        title: initial.title ?? "",
        author: initial.author ?? "",
        publisher: initial.publisher ?? "",
        language: initial.language ?? "",
        year: initial.year ?? "",
        image: initial.image ?? ""
      });
    } else {
      setForm({ id: null, title: "", author: "", publisher: "", language: "", year: "", image: "" });
    }
  }, [initial]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      alert("Title and Author are required.");
      return;
    }
    onSave({ ...form, year: form.year ? Number(form.year) : "" });
  };

  const isEditing = !!form.id;

  return (
    <form className="add-book-form" onSubmit={submit}>
      <input placeholder="Title *" value={form.title} onChange={e=>update("title", e.target.value)} />
      <input placeholder="Author *" value={form.author} onChange={e=>update("author", e.target.value)} />
      <input placeholder="Publisher" value={form.publisher} onChange={e=>update("publisher", e.target.value)} />
      <input placeholder="Language" value={form.language} onChange={e=>update("language", e.target.value)} />
      <input placeholder="Year" type="number" value={form.year} onChange={e=>update("year", e.target.value)} />
      <input placeholder="Image URL" value={form.image} onChange={e=>update("image", e.target.value)} />

      <div className="form-actions">
        <button type="submit">{isEditing ? "Update" : "Add"} Book</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
