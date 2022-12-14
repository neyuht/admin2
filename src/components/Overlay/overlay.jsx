export default function Overlay({ children, onClick }) {
  return (
    <section
      className="overlay"
      onClick={(e) => {
        console.log(123);
        onClick();
      }}
    >
      {children}
    </section>
  );
}
