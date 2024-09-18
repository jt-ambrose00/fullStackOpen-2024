import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (!notification) {
    return null
  }

  const style = {
    backgroundColor: 'lightgrey',
    margin: '10px',
    padding: '10px',
    border: '2px solid',
    borderColor: notification.type === 'success' ? 'green' : 'red',
    borderRadius: '5px',
  }

  return (
    <div style={style}>
      {notification.message}
    </div>
  )
}

export default Notification
