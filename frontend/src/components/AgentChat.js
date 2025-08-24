import { useState, useRef, useEffect } from 'react';
import { 
  Box, VStack, HStack, Input, Button, Avatar, Text, Spinner, 
  Badge, Tooltip, Image, Modal, ModalOverlay, ModalContent, 
  ModalHeader, ModalBody, ModalCloseButton, useDisclosure,
  Progress, Alert, AlertIcon
} from '@chakra-ui/react';
import agents from '../assets/agents.json';

const PERSONALITY_COLORS = {
  'logical_analytical': 'blue.400',
  'creative_innovative': 'purple.400', 
  'versatile_balanced': 'teal.400',
  'privacy_focused': 'orange.400',
  'visual_artist': 'pink.400'
};

const PERSONALITY_EMOJIS = {
  'logical_analytical': '🧠',
  'creative_innovative': '🎨',
  'versatile_balanced': '⚖️',
  'privacy_focused': '🔒',
  'visual_artist': '🖼️'
};

export default function AgentChat({ onLoadingChange }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [activeAgents, setActiveAgents] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loading);
    }
  }, [loading, onLoadingChange]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      setConnectionStatus('connecting');
      ws.current = new WebSocket('ws://localhost:8000/ws/agents');
      
      ws.current.onopen = () => {
        setConnectionStatus('connected');
        setMessages([{
          sender: 'System',
          text: 'Connected to AI Multi-Agent Collaboration Lab! 🚀',
          timestamp: new Date(),
          type: 'success'
        }]);
      };
      
      ws.current.onmessage = (event) => {
        const messageText = event.data;
        
        // Parse agent name and emoji from message
        const match = messageText.match(/^(\w+)\s*([🧠🎨⚖️🔒🖼️🤖]*): (.*)$/);
        
        if (match) {
          const [, agentName, emoji, response] = match;
          setMessages((msgs) => [...msgs, { 
            sender: agentName, 
            text: response,
            emoji: emoji,
            timestamp: new Date()
          }]);
        } else {
          setMessages((msgs) => [...msgs, { 
            sender: 'System', 
            text: messageText,
            timestamp: new Date()
          }]);
        }
        
        setActiveAgents(prev => Math.max(0, prev - 1));
        if (activeAgents <= 1) {
          setLoading(false);
        }
      };
      
      ws.current.onerror = () => {
        setConnectionStatus('error');
        setMessages((msgs) => [...msgs, { 
          sender: 'System', 
          text: 'Connection error. Please check if the backend is running.',
          timestamp: new Date(),
          type: 'error'
        }]);
        setLoading(false);
      };
      
      ws.current.onclose = () => {
        setConnectionStatus('disconnected');
        setLoading(false);
      };
      
    } catch (e) {
      setConnectionStatus('error');
      setMessages((msgs) => [...msgs, { 
        sender: 'System', 
        text: 'WebSocket failed to initialize.',
        timestamp: new Date(),
        type: 'error'
      }]);
    }
  };

  const sendMessage = () => {
    if (!ws.current || ws.current.readyState !== 1) {
      setMessages((msgs) => [...msgs, { 
        sender: 'System', 
        text: 'WebSocket not connected. Attempting to reconnect...',
        timestamp: new Date(),
        type: 'warning'
      }]);
      connectWebSocket();
      return;
    }
    
    if (input.trim()) {
      setMessages((msgs) => [...msgs, { 
        sender: 'You', 
        text: input,
        timestamp: new Date()
      }]);
      setLoading(true);
      setActiveAgents(5); // 5 agents will respond
      
      try {
        ws.current.send(input);
      } catch (e) {
        setMessages((msgs) => [...msgs, { 
          sender: 'System', 
          text: 'Failed to send message.',
          timestamp: new Date(),
          type: 'error'
        }]);
        setLoading(false);
      }
      setInput('');
    }
  };

  const getAgentInfo = (senderName) => {
    const agent = agents.find(a => a.name === senderName);
    return agent || { name: senderName, color: 'gray.400', avatar: 'default.png' };
  };

  const formatTime = (timestamp) => {
    if (!timestamp || !(timestamp instanceof Date)) {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box bg="gray.800" borderRadius="xl" p={6} boxShadow="2xl" maxW="4xl" mx="auto" mt={4}>
      <VStack spacing={4} align="stretch">
        {/* Header with status */}
        <HStack justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold" color="blue.200">
            Multi-Agent Collaboration Lab
          </Text>
          <HStack spacing={2}>
            <Badge 
              colorScheme={connectionStatus === 'connected' ? 'green' : connectionStatus === 'connecting' ? 'yellow' : 'red'}
              variant="solid"
            >
              {connectionStatus}
            </Badge>
            {loading && (
              <Badge colorScheme="purple" variant="solid">
                {activeAgents} agents working...
              </Badge>
            )}
          </HStack>
        </HStack>

        {/* Progress bar when agents are working */}
        {loading && (
          <Progress size="sm" isIndeterminate colorScheme="blue" borderRadius="md" />
        )}

        {/* Messages container */}
        <Box 
          minH="400px" 
          maxH="500px" 
          overflowY="auto" 
          bg="gray.900" 
          borderRadius="md" 
          p={4}
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#2D3748',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#4A5568',
              borderRadius: '4px',
            },
          }}
        >
          {messages.map((msg, i) => {
            const agentInfo = getAgentInfo(msg.sender);
            const isUser = msg.sender === 'You';
            const isSystem = msg.sender === 'System';
            
            // Determine system message styling based on type
            let systemColor = 'green.500';
            let systemBg = 'green.900';
            let systemTextColor = 'green.300';
            let systemIcon = '✅';
            
            if (isSystem && msg.type) {
              switch (msg.type) {
                case 'success':
                  systemColor = 'green.500';
                  systemBg = 'green.900';
                  systemTextColor = 'green.300';
                  systemIcon = '🚀';
                  break;
                case 'error':
                  systemColor = 'red.500';
                  systemBg = 'red.900';
                  systemTextColor = 'red.300';
                  systemIcon = '❌';
                  break;
                case 'warning':
                  systemColor = 'yellow.500';
                  systemBg = 'yellow.900';
                  systemTextColor = 'yellow.300';
                  systemIcon = '⚠️';
                  break;
                default:
                  systemColor = 'blue.500';
                  systemBg = 'blue.900';
                  systemTextColor = 'blue.300';
                  systemIcon = 'ℹ️';
              }
            }
            
            return (
              <HStack key={i} align="start" mb={3} spacing={3}>
                <Tooltip label={`${msg.sender} - ${formatTime(msg.timestamp)}`}>
                  {isUser ? (
                    <Avatar bg="blue.500" icon={<span>🧑</span>} size="sm" />
                  ) : isSystem ? (
                    <Avatar bg={systemColor} icon={<span>{systemIcon}</span>} size="sm" />
                  ) : (
                    <Avatar 
                      bg={agentInfo.color} 
                      icon={<span>{msg.emoji || PERSONALITY_EMOJIS.default || '🤖'}</span>} 
                      size="sm" 
                    />
                  )}
                </Tooltip>
                
                <Box flex="1" bg={isUser ? 'blue.900' : isSystem ? systemBg : 'gray.700'} p={3} borderRadius="lg">
                  <HStack justify="space-between" align="center" mb={1}>
                    <Text 
                      fontWeight="semibold" 
                      color={isUser ? 'blue.300' : isSystem ? systemTextColor : agentInfo.color}
                      fontSize="sm"
                    >
                      {msg.sender}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {formatTime(msg.timestamp)}
                    </Text>
                  </HStack>
                  
                  <Text fontSize="sm" lineHeight="1.5">
                    {msg.text}
                  </Text>
                  
                  {msg.image_data && (
                    <Image 
                      src={`data:image/png;base64,${msg.image_data}`}
                      alt="Generated image"
                      maxW="200px"
                      mt={2}
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => {
                        setSelectedImage(`data:image/png;base64,${msg.image_data}`);
                        onOpen();
                      }}
                    />
                  )}
                </Box>
              </HStack>
            );
          })}
          {loading && <Spinner color="blue.400" size="sm" mt={2} />}
        </Box>
        <HStack>
          <Input
            placeholder="Type your challenge..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            bg="gray.700"
            color="white"
          />
          <Button colorScheme="blue" onClick={sendMessage} isDisabled={loading}>
            Send
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
