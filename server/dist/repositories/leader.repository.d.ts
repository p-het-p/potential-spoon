export declare function createFundraiser(data: any): Promise<any>;
export declare function getFundraisers(): Promise<any[]>;
export declare function getFundraiserById(id: string): Promise<any>;
export declare function updateFundraiser(id: string, data: any): Promise<any>;
export declare function deleteFundraiser(id: string): Promise<any>;
export declare function createVolunteerTask(data: any): Promise<any>;
export declare function getVolunteerTasks(): Promise<any[]>;
export declare function updateVolunteerTask(id: string, data: any): Promise<any>;
export declare function deleteVolunteerTask(id: string): Promise<any>;
export declare function createAnnouncement(data: any): Promise<any>;
export declare function getAnnouncements(role?: string): Promise<any[]>;
export declare function updateAnnouncement(id: string, data: any): Promise<any>;
export declare function deleteAnnouncement(id: string): Promise<any>;
export declare function getMembers(): Promise<any[]>;
export declare function updateMemberStatus(id: number | string, data: {
    status?: string;
    end_date?: string;
}): Promise<any>;
export declare function getAssignableUsers(): Promise<any[]>;
export declare function getMerchOrders(): Promise<any[]>;
export declare function getLeaderStats(): Promise<{
    members: any;
    events: any;
    tasks: any;
    fundraisers: any;
    merchandise: any;
}>;
//# sourceMappingURL=leader.repository.d.ts.map