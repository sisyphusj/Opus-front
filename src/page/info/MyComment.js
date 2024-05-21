import api from "../../api";
import {useEffect, useRef, useState} from "react";
import {Box, Flex, Heading, Table, TextField, Text, WashAnimated} from "gestalt";
import styled from "styled-components";
import {Background, CustomButton} from "../../component/CommonModal";

export default function MyComment() {
    const [commentData, setCommentData] = useState([]);
    const [active, setActive] = useState(false);

    const getCommentData = async () => {
        try {
            const response = await api.get('/comment/list/my-comments');
            console.log(response.data);
            setCommentData(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setActive(false);
        getCommentData();
    }, []);

    const BaseRow = ({data}) => {
        return (
            <Table.RowExpandable
                accessibilityCollapseLabel="Collapse"
                accessibilityExpandLabel="Expand"
                expandedContents={
                    <Box
                        column={12}
                        display="flex"
                        justifyContent="center"
                        maxWidth={236}
                        onMouseDown={() => setActive(!active)}
                        padding={2}
                    >
                        <WashAnimated
                            active={active}
                            image={
                                <Box
                                    column={12}
                                    display="flex"
                                    justifyContent="center"
                                    maxWidth={236}
                                    padding={2}
                                >
                                    {/*<Avatar name={`${name}avatar`} size="md" src={src} />*/}
                                </Box>
                            }
                        >
                            <Text align="center" weight="bold">
                                sample
                            </Text>
                        </WashAnimated>
                    </Box>
                }
                id={data.nick}
                onExpand={() => {
                }}
            >
                <Table.Cell>
                    <Text>{data.nick} 님의 게시글</Text>
                </Table.Cell>
                <Table.Cell>
                    <Text>{data.content}</Text>
                </Table.Cell>
                <Table.Cell>
                    <Text>{data.updatedDate}</Text>
                </Table.Cell>
            </Table.RowExpandable>
        );
    }


    return (
        <Box minHeight={"calc(100vh - 154px)"}>
            <Box marginBottom={6}>
                <Heading> 나의 댓글 </Heading>
            </Box>

                <Table accessibilityLabel={"My Comment"} maxHeight={600}>
                    <Table.Header sticky>
                        <Table.Row>
                            <Table.HeaderCell>
                                <Box display="visuallyHidden">
                                    <Text weight="bold">Open/Close row</Text>
                                </Box>
                            </Table.HeaderCell>
                            {['Pin', 'Content', 'Updated Date'].map((title) => (
                                <Table.HeaderCell key={title}>
                                    <Text weight="bold">{title}</Text>
                                </Table.HeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {commentData.map((data) => (
                            <BaseRow key={data.cid} data={data}/>
                        ))}
                    </Table.Body>
                </Table>
        </Box>
    );
}

const SaveButton = styled(CustomButton)`
    width: 150px;
`;

const DeleteButton = styled(CustomButton)`
    width: 150px;
    border: 1px solid #F2709C;
    color: #F2709C;

    &:hover {
        background: #F2709C;
        color: white;
    }
`;

const ChangeButton = styled(CustomButton)`
    width: 90px;
    height: 49px;
    border-radius: 1rem;
    font-size: 16px;
`;

const CheckSaveBox = styled.div`
    width: 450px;
    height: 200px;
    border-radius: 1rem;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;