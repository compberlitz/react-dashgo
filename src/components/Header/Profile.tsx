import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

interface ProfileProps{
    showProfileData?: boolean;
}

export function Profile({ showProfileData = true } : ProfileProps){
    return (
        <Flex align="center">
            { showProfileData && (
                <Box mr="4" textAlign="right">
                    <Text>Mateus Berlitz</Text>
                    <Text color="gray.300" fontSize="small">
                        wobetoberlitz@gmail.com
                    </Text>
                </Box>
            )}

            <Avatar size="md" name="Mateus Berlitz" src="https://avatars.githubusercontent.com/u/32850300?v=4"/>
        </Flex>
    );
}