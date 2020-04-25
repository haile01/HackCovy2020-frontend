import React from 'react'

const CreateProfile = React.lazy(() => import('../Credentials/CreateProfile'))

const Home: React.FC = () => {
  return (
    <div>
      HOME
      <CreateProfile/>
    </div>
  )
}

export default Home;