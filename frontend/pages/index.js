import { Box, Heading, Text, VStack, Container, HStack, Badge, Grid, GridItem } from '@chakra-ui/react';
import AgentChat from '../src/components/AgentChat';
import AgentStatusDashboard from '../src/components/AgentStatusDashboard';
import AgentTester from '../src/components/AgentTester';
import { useState, useEffect } from 'react';

export default function Home() {
  const [agentStatus, setAgentStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAgentStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/agents/status');
      const data = await response.json();
      setAgentStatus(data);
    } catch (error) {
      console.error('Failed to fetch agent status:', error);
    }
  };

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
          
          <Grid templateColumns={{ base: "1fr", lg: "1fr 300px 400px" }} gap={6} w="full">
            <GridItem>
              <AgentChat onLoadingChange={setLoading} />
            </GridItem>
            <GridItem>
              <AgentStatusDashboard 
                agents={agentStatus?.agents} 
                activeConnections={agentStatus?.active_connections || 0}
                isLoading={loading}
              />
            </GridItem>
            <GridItem>
              <AgentTester />
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
