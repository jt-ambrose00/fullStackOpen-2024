import { useState, forwardRef, useImperativeHandle } from 'react'

import { Box, Button } from '@mui/material'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <>
      <Box style={hideWhenVisible}>
        <Button
          variant='outlined'
          color='primary'
          size='small'
          onClick={toggleVisibility}
        >
          {props.buttonLabel}
        </Button>
      </Box>
      <Box style={showWhenVisible}>
        {props.children}
        <Button
          variant='outlined'
          color='primary'
          size='small'
          style={{ display: 'inline-block' }}
          onClick={toggleVisibility}
        >
          Cancel
        </Button>
      </Box>
    </>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable
