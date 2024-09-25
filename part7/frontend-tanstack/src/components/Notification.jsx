import { Alert } from "@mui/material"

import { useNotificationValue } from "../reducers/NotificationContext"

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification) {
    return null
  }

  return (
    <Alert severity={notification.type}>
      {notification.message}
    </Alert>
  )
}

export default Notification
