interface TransparentFigureProps {
  src: string;
  alt: string;
  className?: string;
}

const TransparentFigure = ({ src, alt, className = "" }: TransparentFigureProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`object-contain ${className}`}
      style={{ background: 'transparent' }}
    />
  );
};

export default TransparentFigure;
