import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import moment from 'moment';


function JournalReview(props) {
    const [userUid, setUserUid] = useState("");
    const [journalEntries, setJournalEntries] = useState([]);

    useEffect(() => {
        if (firebase.auth().currentUser) {
            setUserUid(firebase.auth().currentUser.uid);

            firebase.firestore().collection("journalEntries")
            .where("uid", "==", firebase.auth().currentUser.uid)
            .orderBy("created_at", "desc")
            .get()
            .then((querySnapshot) => {
                let journalEntries = [];
                querySnapshot.forEach((entry) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(entry.id, " => ", entry.data());
                    // console.log("Day diff: ", moment().diff(moment(entry.data().created_at.toDate()), 'days'));
                    
                    let dayDiff = moment().diff(moment(entry.data().created_at.toDate()), 'days');
                    if (props.unit.review_intervals.includes(dayDiff)) {
                        journalEntries.push(entry.data());
                    }
                });
                console.log("journalEntries: ", journalEntries);
                setJournalEntries(journalEntries);
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

        }
        console.log('JournalReview() props: ', props);
    },[]);

    let journalEntryContent = [];
    journalEntries.map((entry, index) => {
        console.log('Journal entry: ', entry);
        journalEntryContent.push(
            <div key={index} className="journal-entry-container">
                <strong>{moment(entry.created_at.toDate()).format("dddd, MMMM Do")}</strong>
                <br />
                <i>{entry.prompt}</i>
                <br />
                {entry.entry}
                <br /><br />
            </div>
        );
      });
  
    return journalEntryContent;
}

export default JournalReview;