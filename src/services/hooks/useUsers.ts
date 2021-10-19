import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { string } from "yup/lib/locale";
import { api } from "../api";

export interface User{
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

interface GetUsersResponse{
    totalUsers: number;
    users: User[]
}

export async function getUsers(page: number): Promise<GetUsersResponse>{
    const { data, headers } = await api.get('users', {
        params: {
            page
        }
    });

    const totalUsers = Number(headers['x-total-count']);
    
    const users = data.users.map(user => {
        return {
            ...user,
            createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    });

    return {
        users,
        totalUsers
    };
}

export function useUsers(page: number, options: UseQueryOptions){
    return useQuery(['users', page], () => getUsers(page), {
        staleTime: 1000 * 5, //fresh
        ...options
    }) as UseQueryResult<GetUsersResponse, unknown>;
}