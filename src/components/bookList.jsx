export default function BookList({ books, onEdit, onDelete }) {
    return (
        <section>
        <table style={{width: "100%", borderCollapse: "collapse"}}>
            <thead>
            <tr style={{textAlign: "left"}}>
                <th style={th}>Title</th>
                <th style={th}>Author</th>
                <th style={th}>Publisher</th>
                <th style={th}>Language</th>
                <th style={th}>Year</th>
                <th style={th}>Actions</th>
            </tr>
            </thead>
            <tbody>
            {books.length === 0 ? (
                <tr><td colSpan="6" style={{padding: 12}}><p>No books match your filters.</p></td></tr>
            ) : books.map(b => (
                <tr key={b.id}>
                <td style={td}>{b.title}</td>
                <td style={td}>{b.author}</td>
                <td style={td}>{b.publisher}</td>
                <td style={td}>{b.language}</td>
                <td style={td}>{b.year ?? ""}</td>
                <td style={td}>
                    <button onClick={()=>onEdit(b.id)}>Edit</button>
                    <button onClick={()=>{ if (confirm("Delete this book?")) onDelete(b.id); }} style={{marginLeft: 8}}>
                    Delete
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </section>
    );
}

const th = { padding: 8, borderBottom: "1px solid #ddd" };
const td = { padding: 8, borderBottom: "1px solid #f0f0f0" };
