type FeatureCardProps = {
  title: string;
};

// Knows nothing about Storyblok — plain props in, markup out. `...rest` must be
// spread onto the root element, or storyblokEditable's data-blok-* attributes
// never reach the DOM and the block can't be clicked in the visual editor.
export default function FeatureCard({ title, ...rest }: FeatureCardProps) {
  return (
    <div
      className={`rounded-lg border border-foreground/15 p-0`}
      {...rest}
    >
      <h3 className="text-lg font-medium">{title}</h3>
    </div>
  );
}
