'use client';
import {
  ChangeEvent,
  useEffect,
  useState
} from 'react';

import {
  useSearchParams,
  useRouter
} from 'next/navigation';

import {
  Button,
  Checkbox
} from "@nextui-org/react";

import { signIn, useSession } from "next-auth/react";

import {
  FaUser,
  FaLock
} from 'react-icons/fa6';

import {
  BiSolidLogIn
} from 'react-icons/bi';

import {Spinner} from "@nextui-org/react";

import Background from '@Resources/image/background.png';

import { Form } from '@Components/inputs/form.component';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    password: "",
  });
  const [error, setError] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const {status} = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      void router.push("/dashboard");
    } else {
      setPage(true)
    }
  }, [status, router]);

  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const res = await signIn("credentials", {
        redirect: false,
        name: formValues.name,
        password: formValues.password,
        callbackUrl,
      });

      setLoading(true);

      if (!res?.error) {
        setLoading(true);
        router.push(callbackUrl);
      } else {
        setError(true);
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return page ? (
    <main className='w-full min-h-screen bg-cover bg-top flex py-6' style={{
      backgroundImage: `url('${Background.src}')`
    }}>
      <div className='m-auto w-full flex flex-col h-full items-center justify-center px-6'>
        <form autoComplete="off" onSubmit={onSubmit} className='max-w-sm container bg-white rounded p-5 flex flex-col gap-4'>
          <div className='flex flex-col gap-3'>
            <h1 className='text-3xl font-bold'> Login </h1>
            <h2 className='text-md opacity-60'> Acecperu Dashboard </h2>
          </div>
    
          <div className='container flex flex-col gap-2'>
            <Form 
              icon={FaUser}
              placeholder="user" 
              type="text"
              name='name'
              onChange={handleChange}
              value={formValues.name}
              content={formValues.name}
              isError={error}
            />
            <Form 
              icon={FaLock}
              placeholder="password" 
              type="password"
              name="password"
              onChange={handleChange}
              value={formValues.password}
              content={formValues.password}
              isError={error}
            />
            <Checkbox className='mt-2'> Remember me </Checkbox>
          </div>

          {error ? <span className='text-sm text-center text-red-600 block mt-1'> user or password incorrect {error} </span> : <></>}

          <Button
            type="submit"
            isLoading={loading}
            className={`w-full flex items-center gap-2 justify-center px-3 py-6 rounded text-white font-semibold text-lg bg-blue-500 ${loading ? "brightness-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
          > 
            {loading ?
              <>
                <span> Cargando </span>
              </> :
              <>
                <BiSolidLogIn />
                <span> SUBMIT </span>
              </>
            }
          </Button>

        </form>

        <div className='mt-5 flex flex-col gap-3 text-white text-center text-xs'>
          <span> © Acecperu Dashboard 2023 | Todos los derechos reservados </span>
          <strong> Version v1.0 </strong>
        </div>
      </div>  
    </main>
  ) : <></>
}
