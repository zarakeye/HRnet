interface ContainerProps {
  children: React.ReactNode
}

/**
 * Container component, centers its children horizontally and vertically.
 *
 * @param {React.ReactNode} children Component children.
 * @returns {React.ReactElement} Container component.
 */
function Container ({ children }: ContainerProps): JSX.Element {
  return (
    <div className='container flex flex-col justify-center items-center mx-auto'>
      {children}
    </div>
  )
}

export default Container