import { useState } from 'react';
import { 
  Box, VStack, HStack, Text, Badge, Progress, 
  Button, Modal, ModalOverlay, ModalContent, 
  ModalHeader, ModalBody, ModalCloseButton, 
  useDisclosure, Tooltip 
} from '@chakra-ui/react';

const AgentStatusDashboard = ({ agents, activeConnections, isLoading }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'ready': return 'green';
      case 'working': return 'blue';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  const personalityDescriptions = {
    'logical_analytical': 'Focuses on structured reasoning and step-by-step problem solving',
    'creative_innovative': 'Brings artistic flair and unconventional approaches to challenges',
    'versatile_balanced': 'Provides well-rounded perspectives with multimodal capabilities',
    'privacy_focused': 'Emphasizes local processing and data security',
    'visual_artist': 'Specializes in transforming ideas into stunning visual representations'
  };

  return (
    <>
      <Box bg="gray.700" borderRadius="lg" p={4} minW="300px">
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <Text fontWeight="bold" color="blue.200">Agent Status</Text>
            <Button size="xs" onClick={onOpen} variant="ghost" colorScheme="blue">
              Details
            </Button>
          </HStack>
          
          <Text fontSize="sm" color="gray.300">
            Active Connections: {activeConnections}
          </Text>
          
          {isLoading && (
            <Progress size="sm" isIndeterminate colorScheme="blue" borderRadius="md" />
          )}
          
          <VStack spacing={2} align="stretch">
            {agents?.map((agent, i) => (
              <HStack key={i} justify="space-between">
                <Tooltip label={personalityDescriptions[agent.personality]}>
                  <Text fontSize="sm" color="white" cursor="help">
                    {agent.name}
                  </Text>
                </Tooltip>
                <Badge 
                  colorScheme={getStatusColor(agent.status)} 
                  variant="solid" 
                  size="sm"
                >
                  {agent.status}
                </Badge>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader color="white">Agent Details</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              {agents?.map((agent, i) => (
                <Box key={i} p={4} bg="gray.700" borderRadius="md">
                  <VStack spacing={2} align="start">
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="bold" color="white">{agent.name}</Text>
                      <Badge colorScheme={getStatusColor(agent.status)} variant="solid">
                        {agent.status}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.300">
                      Personality: {agent.personality.replace('_', ' ')}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {personalityDescriptions[agent.personality]}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AgentStatusDashboard;
