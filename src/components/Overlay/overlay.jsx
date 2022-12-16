export default function Overlay({ children, onClick }) {
  return (
    <section
      className="overlay"
      onClick={(e) => {
        onClick();
      }}
    >
      {children}
    </section>
  );
}
