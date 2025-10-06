export default function CardGrid({ items, renderItem, heightOffset = 220 }) {
  return (
    <div className="cx-grid" style={{ maxHeight: `calc(100vh - ${heightOffset}px)` }}>
      {items.map(renderItem)}
    </div>
  );
}
