interface ContainerProps {
  children: React.ReactNode
}

function Container ({ children }: ContainerProps): JSX.Element {
  return (
    <div className='container flex flex-col justify-center items-center mx-auto'>
      {children}
    </div>
  )
}

export default Container