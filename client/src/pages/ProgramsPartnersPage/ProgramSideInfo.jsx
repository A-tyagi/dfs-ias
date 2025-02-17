import React from "react";
import Fade from 'react-reveal/Fade';
import {CalendarWeek, GeoAltFill, PencilSquare, PeopleFill, Trash} from 'react-bootstrap-icons';
import { Button, Badge } from 'react-bootstrap';
import { formatAvailability } from "../../util/formatData";
import {
    Wrapper,
    Title,
    Avatar,
    Subtitle,
    Text,
    ProgramSection,
} from "../../design-system/components/SideInfo";
import { partnerSymbols } from "../../constant";


const ProgramSideInfo = (props) => {
    const { program, onDeletePress } = props;
    const [ imageBase64, setImageBase64 ] = React.useState(null);

    React.useEffect(() => {
        if(program) setImageBase64(new Buffer.from(program.logo.data).toString("ascii"));
    }, [program]);

    const totalAssigned = () => {
        let instructorCount = 0;
        program.classes.forEach((e) => {
            instructorCount += e.instructorsNeeded;
        })

        return instructorCount.toString();
    }

    if (!program) {
        return (
            <></>
        )
    }

    return (
        <Wrapper>
            <Fade right duration={200}>
                <div>
                    <Title>
                        {program.name}
                    </Title>
                    <Button variant="danger" onClick={() => onDeletePress("PROGRAM", program.programId)}>Delete Program
                        <span style={{marginLeft: '0.5rem'}}><Trash/></span>
                    </Button>
                    <div style={{margin: "2rem 0"}}>
                        <Avatar src={imageBase64} />
                    </div>
                    <Subtitle>
                        <PeopleFill/><span style={{marginLeft: '1rem'}}>{totalAssigned()} instructors</span>
                    </Subtitle>
                    <Button variant="info" onClick={() => props.openModal('ClassToProgram')}>Add Classes
                        <span style={{marginLeft: '0.5rem'}}><PencilSquare/></span>
                    </Button>

                    { program.classes.map((e, idx) =>
                        <ProgramSection key={idx}>
                            <Subtitle>{partnerSymbols[e.partner.type]} {e.partner.name}</Subtitle>
                            <Text>
                                <PeopleFill/><span style={{marginLeft: '1rem'}}>{e.instructorsNeeded} instructors needed</span>
                            </Text>
                            <Text><CalendarWeek/>
                                { formatAvailability(e.timings).map((e, idx) => {
                                    return (
                                        <>
                                            <span key={idx} style={{marginLeft: '1rem'}}>
                                                {e}
                                            </span><br/>
                                        </>)
                                })}
                            </Text>
                            <Badge style={{marginTop: '1rem'}} variant="secondary">{e.partner.district}</Badge>
                        </ProgramSection>
                    )}
                </div>
            </Fade>
        </Wrapper>
    )
}

export default ProgramSideInfo;