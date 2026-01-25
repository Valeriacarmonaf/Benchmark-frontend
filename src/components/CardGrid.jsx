export default function CardGrid({ items, renderItem }) {
  return (
    <div className="cx-grid">
      {items.map(renderItem)}
    </div>
  );
}
