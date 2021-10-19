import { Box, Button, Checkbox, Flex, Heading, Icon, IconButton, Link, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from '@chakra-ui/react';
import { RiAddLine, RiPencilLine } from 'react-icons/ri';

import NextLink from 'next/link';

import { Sidebar } from '../../components/SideBar';
import { Header } from '../../components/Header';
import { Pagination } from '../../components/Pagination';
import { getUsers, User, useUsers } from '../../services/hooks/useUsers';
import React, { useState } from 'react';
import { queryClient } from '../../services/queryClient';
import { api } from '../../services/api';
import { GetServerSideProps } from 'next';

interface UserListProps{
    users: User[];
}

export default function UserList({users}){
    const [page, setPage] = useState(1);
    const { data, isLoading, isFetching, error} = useUsers(page, {
        initialData: users
    });

    console.log(page);

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    })

    async function handlePrefetchUser(userId:string){
        console.log(userId);
        await queryClient.prefetchQuery(['user', userId], async () => {
            const response = await api.get(`users/${userId}`);

            return response.data;
        }, {
            staleTime: 1000 * 60 * 10,
        });
    }
    
    return (
        <Box>
            <Header/>

            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
                <Sidebar/>

                <Box flex="1" borderRadius={8} bg="gray.800" p="8">
                    <Flex mb="8" justify="space-between" align="center">
                        <Heading size="lg" fontWeight="normal">
                            Usuários
                            { !isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4"/>}
                        </Heading>

                        <NextLink href="/users/create" passHref>
                            <Button as="a" size="sm" fontSize="sm" colorScheme="pink" leftIcon={<Icon as={RiAddLine} fontSize="20"/>}>Criar Novo</Button>
                        </NextLink>
                    </Flex>

                    { isLoading ? (
                        <Flex justify="center">
                            <Spinner/>
                        </Flex>
                    ) : error ? (
                        <Flex justify="center">
                            <Text>Erro ao obter os dados dos usuários</Text>
                        </Flex>
                    ) : (
                        <>
                            <Table colorScheme="whiteAlpha">
                                <Thead>
                                    <Tr>
                                        <Th px={["3","4","6"]} color="gray.300" width="8">
                                            <Checkbox colorScheme="pink"/>
                                        </Th>
                                        <Th>Usuário</Th>
                                        {isWideVersion && <Th>Data de cadastro</Th>}
                                        {isWideVersion && <Th w="8"></Th>}
                                    </Tr>
                                </Thead>

                                <Tbody>
                                    {data.users.map(user => {
                                        return (
                                            <Tr key={user.id}>
                                                <Td px={["3","4","6"]}>
                                                    <Checkbox colorScheme="pink"/>
                                                </Td>
                                                <Td>
                                                    <Box>
                                                        <Link color="purple.400" onMouseEnter={() => handlePrefetchUser(user.id)}>
                                                            <Text fontSize={["sm", "md"]} fontWeight="bold">{user.name}</Text>
                                                        </Link>
                                                        <Text fontSize={["12","sm" ]} color="gray.300">{user.email}</Text>
                                                    </Box>
                                                </Td>
                                                {isWideVersion && <Td>{user.createdAt}</Td>}
                                                    {isWideVersion 
                                                    ? 
                                                        <Td>
                                                            <Button as="a" size="sm" fontSize="sm" colorScheme="purple" leftIcon={<Icon as={RiPencilLine} fontSize="16" />}>
                                                                Editar
                                                            </Button>
                                                        </Td>
                                                    : 
                                                        ''// <Td><IconButton aria-label="Editar usuário" as="a" size="sm" fontSize="sm" colorScheme="purple" icon={<Icon as={RiPencilLine} fontSize="16"/>} /></Td>
                                                    }
                                            </Tr>
                                        )
                                    })}
                                </Tbody>
                            </Table>

                            <Pagination totalCountOfRegister={data.totalUsers} currentPage={page} onPageChange={setPage}/>
                        </>
                    )}

                    
                </Box>
            </Flex>
        </Box>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    const { users, totalUsers } = await getUsers(1);

    return {
        props: {
            users
        }
    }
}