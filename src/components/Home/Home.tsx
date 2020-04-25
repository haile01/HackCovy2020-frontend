import React from 'react'

const SignIn = React.lazy(() => import('../Credentials/SignIn'))

const Home: React.FC = () => {
  return (
    <div>
      HOME
      <SignIn/>
    </div>
  )
}

export default Home;