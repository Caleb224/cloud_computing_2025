"use client";

// import { useState, useEffect } from "react";
// import { generateClient } from "aws-amplify/data";
// import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
// import {Skeleton} from "@/components/ui/skeleton";
// import {useAuthenticator} from "@aws-amplify/ui-react";

Amplify.configure(outputs);

// const client = generateClient<Schema>({authMode: 'userPool'});

export default function App() {
  // const {user} = useAuthenticator();
  // const [profileData, setProfileData] = useState<Schema['UserProfile']['type']>();
  // const [loading, setLoading] = useState<boolean>(true);
  //
  // const getUserProfile = async () => {
  //   try {
  //     const userProfile = await client.models.UserProfile.list({
  //       filter: {
  //         email: {
  //           eq: user?.signInDetails?.loginId
  //         }
  //       }
  //     });
  //     setProfileData(userProfile.data[0]!);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error getting user profile", error);
  //   }
  // }
  //
  // useEffect(() => {
  //   getUserProfile();
  // }, []);

  return <h1>Hello</h1>;

  // return (
  //   <div className="h-full w-full p-10">
  //     {loading ? <Skeleton className="h-1/2 w-full rounded-xl"/> :
  //         <h1>{JSON.stringify(profileData, null, 2) || "Hello"}</h1>
  //     }
  //   </div>
  // );
}
