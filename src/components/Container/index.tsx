interface ContainerProps {
  children: React.ReactNode
}

function Container ({ children }: ContainerProps): JSX.Element {
  return (
    <div className='container mx-auto flex flex-col justify-center items-center'>
      {children}
    </div>
  )
}

export default Container