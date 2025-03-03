interface ContainerProps {
  children: React.ReactNode
}

function Container ({ children }: ContainerProps): JSX.Element {
  return (
    <div className='flex flex-col justify-center px-[100px]'>
      {children}
    </div>
  )
}

export default Container