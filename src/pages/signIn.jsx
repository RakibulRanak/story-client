import Layout from "../components/generic/layout";
import { AuthContext } from "../context/authContext";
import { Redirect } from "react-router-dom";
import {
    Box,
    Button,
    Center,
    Input,
    InputGroup,
    Heading,
    Text,
    Spinner,
    useToast,
    Link,
    InputRightElement
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";

const SignIn = (props) => {
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [requestState, setRequestState] = useState("not-requested");
    const [message, setMessage] = useState(null)
    const toast = useToast();
    const { loggedIn, login } = useContext(AuthContext);
    const handleClick = () => setShow(!show)
    const signIn = (e) => {
        e.preventDefault();
        setRequestState("loading");


        axios
            .post("/api/v1/users/login", { username, password })
            .then((res) => {
                setRequestState("loaded");
                login(res.data.data)
                toast({
                    title: "Logged In successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

            })
            .catch((err) => {
                setRequestState("error");
                // console.log(err.response.data.message)
                setMessage(err.response.data.message)
            });
    };

    if (loggedIn) return <Redirect to="/" />;
    else
        return (
            <Layout>
                <Center h={["75vh", "85vh"]}>
                    <Box
                        boxShadow="xl"
                        textAlign="center"
                        bg="white"
                        borderRadius={5}
                        p={4}
                    >
                        <Heading size="md" m={1}>
                            Log In
                        </Heading>
                        <form onSubmit={signIn}>
                            <InputGroup m={1}>
                                <Input
                                    type="text"
                                    placeholder="Username"
                                    name="username"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </InputGroup>
                            <InputGroup m={1}>
                                <Input
                                    type={show ? "text" : "password"}
                                    placeholder="Password"
                                    name="password"
                                    show={show}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <InputRightElement width="4.5rem">
                                    <Button boxShadow="none !important" h="1.75rem" size="sm" onClick={handleClick}>
                                        {show ? "Hide" : "Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>

                            <Text display="block" fontSize="sm" color="tomato">
                                {message}
                            </Text>
                            <Button
                                colorScheme="teal"
                                size="sm"
                                m={1}
                                mb={4}
                                disabled={requestState === "loading" ? 1 : 0}
                                type="submit"
                            >
                                {requestState === "loading" && <Spinner mr={3} />}Sign In
                            </Button>
                        </form>


                        <Text fontSize="xs">
                            <Link color="teal.500" href="/signup" m={1}>
                                Don't have an account?
                            </Link>
                        </Text>


                    </Box>
                </Center>
            </Layout>
        );
};

export default SignIn;