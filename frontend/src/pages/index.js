import { Box, Heading, Text, VStack, Container, HStack, Badge } from '@chakra-ui/react';
import AgentChat from '../components/AgentChat';

export default function Home() {
  return (
    <Box minH="100vh" bgGradient="linear(to-br, gray.900, blue.900)" color="white">
      <Container maxW="8xl" py={8}>
        <VStack spacing={8} align="center">
          <VStack spacing={4} textAlign="center">
            <HStack spacing={4} align="center">
              <Heading size="2xl" fontWeight="extrabold" letterSpacing="tight" textShadow="0 2px 8px #000">
                AI Multi-Agent Collaboration Lab
              </Heading>
              <Badge colorScheme="purple" variant="solid" fontSize="md" px={3} py={1}>
                v1.0
              </Badge>
            </HStack>
            <Text fontSize="xl" opacity={0.8} maxW="4xl" lineHeight="1.6">
              Experience the future of AI: Multiple specialized agents collaborate, debate, and solve complex challenges in real time. 
              Each agent brings unique capabilities and personalities to deliver comprehensive solutions.
            </Text>
            <HStack spacing={4} wrap="wrap" justify="center">
              <Badge colorScheme="blue" variant="outline">OpenAI GPT-4</Badge>
              <Badge colorScheme="purple" variant="outline">HuggingFace Models</Badge>
              <Badge colorScheme="teal" variant="outline">Google Gemini</Badge>
              <Badge colorScheme="orange" variant="outline">Ollama Local</Badge>
              <Badge colorScheme="pink" variant="outline">Stability AI</Badge>
            </HStack>
          </VStack>
          
          <AgentChat />
        </VStack>
      </Container>
    </Box>
  );
}
