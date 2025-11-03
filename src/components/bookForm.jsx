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
      <h2>{isEditing ? "Edit Book" : "Add Book"}</h2>

      <input placeholder="Title *" value={form.title} onChange={e=>update("title", e.target.value)} />
      <input placeholder="Author *" value={form.author} onChange={e=>update("author", e.target.value)} />
      <input placeholder="Publisher

