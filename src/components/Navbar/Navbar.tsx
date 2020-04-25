import React, { useEffect } from 'react'
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar'
import { IButtonProps } from 'office-ui-fabric-react/lib/Button'
import { connect } from 'react-redux'
import history from '../../utils/history' 

import { setUser } from '../../actions/userAction'
import api from '../../utils/api'

const overflowProps: IButtonProps = { ariaLabel: 'More commands' };

const _items: ICommandBarItemProps[] = [
  {
    key: 'home',
    text: 'Home',
    cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
    iconProps: { iconName: 'Home' },
    href: '/',
  },
  {
    key: 'book',
    text: 'Book',
    onClick: () => history.push('/book')
  },
  {
    key: 'search',
    text: 'Search',
    onClick: () => history.push('/search')
  },
];

const _overflowItems: ICommandBarItemProps[] = [
  { key: 'move', text: 'Move to...', onClick: () => console.log('Move to'), iconProps: { iconName: 'MoveToFolder' } },
  { key: 'copy', text: 'Copy to...', onClick: () => console.log('Copy to'), iconProps: { iconName: 'Copy' } },
  { key: 'rename', text: 'Rename...', onClick: () => console.log('Rename'), iconProps: { iconName: 'Edit' } },
];

const Navbar: React.FC = (props: any) => {

  useEffect(() => {
    if (localStorage.getItem('token'))
    api.getSession().then((res: any) => {
      if (res.success) {
        props.setUser(res.data);
      }
    })
  }, [props.user._id])

  const signOut = () => {
    props.setUser({});
    localStorage.removeItem('token');
    history.push('/')
  }
  
  console.log('nav', props.user)

  const _farItems: ICommandBarItemProps[] = [
    {
      key: 'sign-out',
      text: 'Sign Out',
      // This needs an ariaLabel since it's icon-only
      ariaLabel: 'Sign Out',
      onClick: () => signOut(),
    },
  ];

  let profile = []
  if (props.user.hasOwnProperty('_id')) {
    profile = [
      {
        key: 'profile',
        text: props.user.fullName,
        // This needs an ariaLabel since it's icon-only
        ariaLabel: 'Profile',
        onClick: () => history.push('/profile')
      },
      ..._farItems
    ]
  }
  
  return (
    <div className="nav">
      <CommandBar
        items={_items}
        overflowItems={_overflowItems}
        overflowButtonProps={overflowProps}
        farItems={profile}
        ariaLabel="Use left and right arrow keys to navigate between commands"
      />
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchtoProps = dispatch => ({
  setUser: payload => dispatch(setUser(payload))
})


export default connect(mapStateToProps, mapDispatchtoProps)(Navbar);