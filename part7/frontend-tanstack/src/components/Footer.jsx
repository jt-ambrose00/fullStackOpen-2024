import React from 'react'

import { Box, Typography, Link, Divider } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import XIcon from '@mui/icons-material/X'

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: '#707070',
        color: 'white',
        textAlign: 'center',
        width: '100%',
        mt: 'auto',
        py: 1.5,
      }}
    >
        <Typography>Bloglist Application</Typography>
        <Typography variant="body2">
          Created for Full Stack Open - 2024
        </Typography>
        <Typography variant="body2">
          Source code&nbsp;
          <Link 
            href="https://github.com/jt-ambrose00/fullStackOpen-2024"
            color='inherit'
          >
            repository
          </Link>
        </Typography>
        <Divider sx={{ bgcolor: 'white', my: 1.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Link href="https://github.com" color="inherit">
            <GitHubIcon />
          </Link>
          <Link href="https://linkedin.com" color="inherit">
            <LinkedInIcon />
          </Link>
          <Link href="https://twitter.com" color="inherit">
            <XIcon />
          </Link>
        </Box>
    </Box>
  )
}

export default Footer
