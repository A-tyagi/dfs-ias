import React, {useState, useContext, useEffect} from 'react';
import OptionsBar from './OptionsBar';
import './OptionsBar.scss';
import {Select} from '../../design-system/form';
import { Page, SideInfoWrapper, Wrapper, GalleryWrapper } from '../../design-system/layout/Styled';
import AddNewProgramModal from '../../components/AddNewProgramModal';
import AddNewPartnerModal from '../../components/AddNewPartnerModal';
import AddClassToProgramModal from "../../components/AddClassToProgramModal";
import {saveProgram, savePartner, deleteProgram, deletePartner} from '../../api';
import {saveClass} from "../../api/class";
import { PartnerCard, ProgramCard } from '../../design-system/components/Cards';
import {GlobalContext} from "../../context/GlobalContextProvider";
import Lottie from 'lottie-react';
import emptyAnimation from '../../assets/empty-animation.json';
//dummy data: to be removed once connect to backend
import PartnerSideInfo from "./PartnerSideInfo";
import ProgramSideInfo from "./ProgramSideInfo";
import {Button, FormControl, InputGroup, Modal} from "react-bootstrap";
import {Filter, PlusCircle, Search} from "react-bootstrap-icons";
import AddClassToPartnerModal from "../../components/AddClassToPartnerModal";

let ProgramsPartners;
export default ProgramsPartners = () => {
    const {
        setToastText,
        programData,
        partnerData,
        fetchProgramsAggregatedForCurrentSeason,
        fetchPartnersAggregatedForCurrentSeason
    } = useContext(GlobalContext);
    const [viewType, setViewType] = useState("Programs");
    const [modalType, setModalType] = useState(null);
    const [filterType, setFilterType] = useState("All");
    const [dataIdFocus, setDataIdFocus] = useState(null);
    const [showInputModal, setShowInputModal] = useState(false);

    const handleCloseInputModal = () => {
        console.log('hey you');
        setModalType(null);
        setShowInputModal(false);
    }

    const handleOpenInputModal = (type) => {
        setModalType(type);
    }

    useEffect(() => {
        if (modalType) setShowInputModal(true);
    }, [modalType])

    const getViewType = (type) => {
        setViewType(type);
        setDataIdFocus(null);
    }

    const handleCardClick = (data) => {
        setDataIdFocus(data);
    }

    const renderSideInfo = () => {
        if (dataIdFocus !== null) {
            if (viewType === "Partners") {
                return (
                    <PartnerSideInfo
                        partner={partnerData[dataIdFocus]}
                        openModal={handleOpenInputModal}
                        onDeletePress={onDeletePress}
                    />
                )
            }
            else if (viewType === "Programs") {
                return (
                    <ProgramSideInfo
                        program={programData[dataIdFocus]}
                        openModal={handleOpenInputModal}
                        onDeletePress={onDeletePress}
                    />
                )
            }
        }
    }

    const handleSubmit = async (type, data) => {
        switch(type) {
            case 'PROGRAM':
                await saveProgram(data);
                break;
            case 'PARTNER':
                await savePartner(data);
                break;
            case 'CLASS':
                await saveClass(data);
                break;
        }

        handleCloseInputModal();
        fetchPartnersAggregatedForCurrentSeason();
        fetchProgramsAggregatedForCurrentSeason();
    }

    const renderPrograms = () => {
        // TODO: implement rendering by filter here
        const programList = programData !== null && Object.values(programData);

        if (programData === null || programList.length === 0) {
            return (
                <div style={{margin: "2rem auto", backgroundColor: "#ffffff", display: 'flex', padding: '0 2rem 0 1rem', borderRadius: 20, alignItems: 'center'}}>
                    <Lottie animationData={emptyAnimation} style={{width: 200, height: 200}} />
                    {programData === null ? <h5>Looking for programs</h5> : <h5>No program found. Let's add some!</h5>}
                </div>
            )
        }

        return programList.map((e, index) => {
            return <ProgramCard item={e} key={index} onClick={handleCardClick}/>
        })
    }

    const renderPartners = () => {
        // TODO: implement rendering by filter here
        const partnersList = partnerData !== null && Object.values(partnerData);

        if (partnerData === null || partnersList.length === 0) {
            return (
                <div style={{margin: "2rem auto", backgroundColor: "#ffffff", display: 'flex', padding: '0 2rem 0 1rem', borderRadius: 20, alignItems: 'center'}}>
                    <Lottie animationData={emptyAnimation} style={{width: 200, height: 200}} />
                    {partnerData === null ? <h5>Looking for partners</h5> : <h5>No partners found. Let's add some!</h5>}
                </div>
            )
        }

        return partnersList.map((e, index) => {
            return <PartnerCard item={e} key={index} onClick={handleCardClick}/>
        })

    }

    const onDeletePress = async (type, id) => {
        if (type === "PROGRAM") {
            await deleteProgram(id);
            fetchProgramsAggregatedForCurrentSeason();
        } else if (type === "PARTNER") {
            await deletePartner(id);
            fetchPartnersAggregatedForCurrentSeason();
        }
    }

    return (
        <Page>
            <Wrapper>
                <div style={{padding: '2rem 3rem', display: 'flex'}}>
                    <InputGroup>
                        <Select label={'View By: '} options={['Programs', 'Partners']} handler={getViewType} modal={false} state={viewType}/>
                    </InputGroup>
                    <InputGroup>
                        <Button variant="outline-primary" style={{marginLeft: 'auto'}}>
                            <Filter style={{marginRight: '0.5rem'}}/>Filter</Button>
                        <Button variant="primary" style={{marginLeft: '2rem'}} onClick={() => handleOpenInputModal(viewType)}>
                            <PlusCircle style={{marginRight: '0.5rem'}}/><span>Add {viewType.slice(0, -1)}</span></Button>
                    </InputGroup>
                </div>

                <GalleryWrapper>
                    { viewType === "Partners" && renderPartners() }
                    { viewType === "Programs" && renderPrograms() }
                </GalleryWrapper>
            </Wrapper>
            <SideInfoWrapper>
                {renderSideInfo()}
            </SideInfoWrapper>

            <Modal size="lg" show={showInputModal && modalType !== null} onHide={handleCloseInputModal}>
                { modalType === "Programs" && <AddNewProgramModal handleSubmit={handleSubmit}/>}
                { modalType === "Partners" && <AddNewPartnerModal handleSubmit={handleSubmit}/>}
                { modalType === "ClassToProgram" && <AddClassToProgramModal handleSubmit={handleSubmit} programContext={programData[dataIdFocus]}/>}
                { modalType === "ClassToPartner" && <AddClassToPartnerModal handleSubmit={handleSubmit} partnerContext={partnerData[dataIdFocus]}/>}
            </Modal>
        </Page>
    );
}