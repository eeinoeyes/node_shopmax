import { Container } from '@mui/material'
import Chat from '../components/chat/Chat'

function ChatPage() {
   return (
      <Container maxWidth="md" sx={{ marginTop: 10, marginBottom: 13 }}>
         <Chat />
      </Container>
   )
}

export default ChatPage
