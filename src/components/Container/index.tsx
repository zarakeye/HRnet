interface ContainerProps {
  children: React.ReactNode
}

/**
 * A functional component that provides a styled container for its children.
 * The container is a flexbox that centers its content both vertically and horizontally.
 * It is designed to be used as a wrapper to provide consistent styling for various components.
 * 
 * @param children - The React node elements to be rendered inside the container.
 * @returns A JSX element that wraps the children within a styled div.
 */
function Container ({ children }: ContainerProps): JSX.Element {
  return (
    <div className='container flex flex-col justify-center items-center mx-auto'>
      {children}
    </div>
  )
}

export default Container