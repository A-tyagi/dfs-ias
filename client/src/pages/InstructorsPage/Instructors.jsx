import React, {useState, useContext} from 'react';
import './Instructors.scss';
import InstructorsTable from "./InstructorsTable";
import InstructorsSideInfo from "./InstructorsSideInfo";
import {Page, SideInfoWrapper, Wrapper} from '../../design-system/layout/Styled';
import {FormControl, InputGroup, Button, OverlayTrigger, Popover} from "react-bootstrap";
import {PlusCircle, Filter, Search, FileEarmarkTextFill, CloudUploadFill, Link45deg} from 'react-bootstrap-icons';
import AddInstructorManuallyModal from "../../components/AddInstructorManuallyModal";
import {Modal} from "react-bootstrap";
import {parseCSV} from "../../util/csvParse.js";
import {GlobalContext} from "../../context/GlobalContextProvider";
import {toast} from 'react-toastify';
import Lottie from "lottie-react";
import csvLoadingAnimation from '../../assets/idea-into-book-machine.json';
import {saveInstructor, deleteInstructor} from "../../api";


function Instructors() {
    const {
        seasonSelected,
        instructorData,
        programColorMap,
        fetchAllInstructorAggregatedData
    } = useContext(GlobalContext);


    const [instructorFocus, setInstructorFocus] = useState();
    const [showInputModal, setShowInputModal] = useState();
    const [addInstructorMethod, setAddInstructorMethod] = useState(null);
    const [csvHighlighted, setCsvHighlighted] = React.useState(false);
    const [csvAnimation, setCsvAnimation] = React.useState(false);

    const handleCloseInputModal = () => {
        setShowInputModal(false);
    }
    const handleShowInputModal = () => setShowInputModal(true);

    const handleAddInstructorManual = () => setAddInstructorMethod("MANUAL");
    const handleAddInstructorCSV = () => setAddInstructorMethod("CSV");
    const handleAddInstructorReset = () => setAddInstructorMethod(null);

    const handleInstructorRowClicked = (instructor) => {
        setInstructorFocus(instructor);
    }

    const handleAddNewInstructorManually = async (instructor) => {
        // setInstructorData([instructor, ...instructorData])
        await saveInstructor({...instructor, approve: true, seasonId: seasonSelected.seasonId});
        handleCloseInputModal();
        fetchAllInstructorAggregatedData();

    }

    const onDeletePress = async (id) => {
        await deleteInstructor(id);
        fetchAllInstructorAggregatedData();
    }

    const renderModal = (
        <>
            <Modal.Header closeButton style={{padding: '2rem 3rem 0 3rem', border: '0'}}>
                {csvAnimation ?
                    (<Modal.Title style={{fontSize: '24px'}}>Parsing CSV data. Please
                        wait... </Modal.Title>) : (<Modal.Title>Add Instructor</Modal.Title>)}


            </Modal.Header>
            {!addInstructorMethod && (
                <>
                    <Modal.Body>
                        <div style={{display: 'flex', padding: '1rem 5rem'}}>
                            <div onClick={handleAddInstructorCSV} style={{
                                margin: '1rem',
                                height: '100%',
                                width: '50%',
                                borderRadius: '20px',
                                padding: '2rem',
                                backgroundColor: "#F5F7FB",
                                textAlign: "center"
                            }}>
                                <CloudUploadFill size={95}/>
                                <h5 style={{marginTop: '1rem'}}>Upload .csv</h5>
                            </div>
                            <div onClick={handleAddInstructorManual} style={{
                                margin: '1rem',
                                height: '100%',
                                width: '50%',
                                borderRadius: '20px',
                                padding: '2rem',
                                backgroundColor: "#F5F7FB",
                                textAlign: "center"
                            }}>
                                <FileEarmarkTextFill size={96}/>
                                <h5 style={{marginTop: '1rem'}}>Input manually</h5>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{border: '0', padding: '2rem 3rem'}}>
                    </Modal.Footer>
                </>
            )
            }
            {addInstructorMethod === 'CSV' && (
                <>
                    <Modal.Body>
                        <div
                            style={{
                                borderRadius: '6px',
                                border: csvAnimation ? '' : '4px dashed #B5B8BF',
                                backgroundColor: csvHighlighted ? '#F5F7FB' : '#FFFFFF',
                                height: csvAnimation ? '' : '300px',
                                width: csvAnimation ? '' : '300px',
                                textAlign: 'center',
                                margin: '40px 230px 0px',
                                hover: 'scale(1.1)'
                            }}
                            onDragEnter={() => {
                                setCsvHighlighted(true);
                            }}
                            onDragLeave={() => {
                                setCsvHighlighted(false);
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                setCsvHighlighted(false);
                                setCsvAnimation(true);

                                Array.from(e.dataTransfer.files)
                                    .forEach(async (file) => {
                                        const text = await file.text();
                                        // console.log(text);
                                        let result = await parseCSV(text, instructorData, seasonSelected.seasonId);
                                        fetchAllInstructorAggregatedData();
                                        console.log(result);
                                        if (result.error) {
                                            toast(`❌ Error parsing csv, please check for empty columns or rows.`);
                                        } else {
                                            setShowInputModal(false);
                                            toast(`🙌 Csv file parsed successfully!`);
                                            setCsvAnimation(false);
                                        }
                                    });
                            }}
                        >
                            {csvAnimation ?
                                (
                                    <div>
                                        <Lottie style={{
                                            width: '700px',
                                            height: '300px',
                                            marginLeft: '-210px'
                                        }} animationData={csvLoadingAnimation}/>
                                    </div>
                                ) :
                                (
                                    <div style={{marginTop: '70px'}}>
                                        <CloudUploadFill size={95} color={'#0099FF'}/>
                                        <h5 style={{marginTop: '1rem'}}>Drag and Drop .CSV</h5>
                                    </div>
                                )}

                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{border: '0', padding: '2rem 3rem'}}>

                    </Modal.Footer>
                </>
            )
            }
            {addInstructorMethod === 'MANUAL' && (
                <>
                    <AddInstructorManuallyModal handleSubmit={handleAddNewInstructorManually}/>
                </>
            )
            }

        </>
    );

    if (instructorData) {
        return (
            <Page>
                <Wrapper>
                    <div style={{padding: '2rem 5rem', display: 'flex'}}>
                        <InputGroup>
                            <FormControl
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                            />
                            <InputGroup.Append>
                                <Button variant="primary"><Search/></Button>
                            </InputGroup.Append>
                        </InputGroup>

                        <InputGroup>
                            <Button variant="outline-primary" style={{marginLeft: 'auto'}}>
                                <Filter style={{marginRight: '0.5rem'}}/>Filter</Button>
                            <Button variant="primary" style={{marginLeft: '2rem'}} onClick={handleShowInputModal}>
                                <PlusCircle style={{marginRight: '0.5rem'}}/><span>Add Instructor</span></Button>
                            {/* TODO: Self-Onboarding is not ready for production */}
                            {/*<OverlayTrigger*/}
                            {/*    trigger="click"*/}
                            {/*    placement={'bottom'}*/}
                            {/*    overlay={*/}
                            {/*        <Popover>*/}
                            {/*            <Popover.Title as="h3">Onboarding URL</Popover.Title>*/}
                            {/*            <Popover.Content>*/}
                            {/*                <p>Share this URL with instructors to self-onboard*/}
                            {/*                    for the <strong>{seasonSelected.name}</strong> season.</p>*/}
                            {/*                <FormControl*/}
                            {/*                    aria-label="Default"*/}
                            {/*                    aria-describedby="inputGroup-sizing-default"*/}
                            {/*                    value={`localhost:3000/onboarding/${seasonSelected.seasonId}/${encodeURI(seasonSelected.name)}`}*/}
                            {/*                />*/}
                            {/*            </Popover.Content>*/}
                            {/*        </Popover>*/}
                            {/*    }*/}
                            {/*>*/}
                            {/*    <Button variant="secondary" style={{marginLeft: '2rem'}}><Link45deg*/}
                            {/*        style={{marginRight: '0.5rem'}}/>Self-Onboarding</Button>*/}
                            {/*</OverlayTrigger>*/}
                        </InputGroup>
                    </div>

                    <InstructorsTable
                        handleInstructorRowClicked={handleInstructorRowClicked}
                        data={Object.values(instructorData).reverse()}
                        programsColorKey={programColorMap}
                    />
                </Wrapper>
                <SideInfoWrapper>
                    <InstructorsSideInfo
                        instructor={instructorFocus}
                        programsColorKey={programColorMap}
                        onDeletePress={onDeletePress}
                    />
                </SideInfoWrapper>

                <Modal size="lg" show={showInputModal} onHide={handleCloseInputModal}
                       onExited={handleAddInstructorReset}>
                    {renderModal}
                </Modal>
            </Page>
        );
    } else {
        return <></>
    }
}

export default Instructors;