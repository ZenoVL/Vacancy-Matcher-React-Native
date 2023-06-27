import {Chip} from "react-native-paper";
import {Text, StyleSheet} from "react-native"
import {globalStyle} from "../../styles/globalStyle";

interface LegendProps {
    isOwner: boolean | undefined
}

export function Legend({isOwner}: LegendProps) {
    return <>
        <Text style={styles.legendTitle}>Legende</Text>
        {isOwner && (
            <Chip style={styles.legendMine}><Text style={styles.legendText}>Mijn panden</Text></Chip>
        )}
        <Chip style={styles.legendClaimed}><Text style={styles.legendText}>Geclaimd</Text></Chip>
        <Chip style={styles.legendNotClaimed}><Text style={styles.legendText}>Niet geclaimd</Text></Chip>
    </>
}

const styles = StyleSheet.create({
    legendMine: {
        margin: 2,
        backgroundColor: globalStyle.premises.drawColor
    },
    legendClaimed: {
        margin: 2,
        backgroundColor: globalStyle.premises.claimedColor
    },
    legendNotClaimed: {
        margin: 2,
        backgroundColor: globalStyle.premises.color
    },
    legendText: {
        fontSize: 10,
        color: "white"
    },
    legendTitle: {
        fontWeight: 'bold',
        marginBottom: 4,
        marginLeft: 5
    }
})
