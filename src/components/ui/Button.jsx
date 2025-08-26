export const Button = ({ ...props }) => {
  return <button className={`bg-accent text-accent-foreground px-4 py-2 rounded-md font-medium hover:brightness-85 w-fit transiton-all duration-100 ${props.className}`} {...props} />
}