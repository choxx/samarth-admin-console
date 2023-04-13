
import { useDataProvider } from 'react-admin';
import { useQuery } from "react-query";
import * as _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from 'react';


export const useGetLocationDetails = () => {
    const [districts, setDistricts] = useState<any>(null)
    const [blocks, setBlocks] = useState<any>(null)
    const [clusters, setClusters] = useState<any>(null)
    const dataProvider = useDataProvider();



    const { data: _districtData, isLoading, error }: any = useQuery(
        ['location', 'getList', {}],
        () => dataProvider.getList('location', {
            pagination: { perPage: 10000, page: 1 },
            sort: { field: 'id', order: 'asc' },
            filter: {}
        })
    );


    const districtData = useMemo(() => {
        return _districtData?.data
    }, [_districtData])



    const getDistrictList = () => {
        if (!districtData) {
            return [];
        }
        let res = _.uniqBy(districtData, "district").map((a: any) => {
            return {
                id: a.district,
                name: a.district,
            };
        });
        setDistricts(res)
    }

    const getBlockList = (userSelectedDistrict?: any) => {
        console.log(userSelectedDistrict, "inside get block")
        if (!districtData) {
            return [];
        }
        if (!userSelectedDistrict) {
            let res = _.uniqBy(
                districtData,
                "block"
            ).map((a: any) => {
                return {
                    id: a.block,
                    name: a.block,
                };
            });
            setBlocks(res)
            return
        }
        let res = _.uniqBy(
            districtData.filter((d: any) => d.district === userSelectedDistrict),
            "block"
        ).map((a: any) => {
            return {
                id: a.block,
                name: a.block,
            };
        });

        setBlocks(res)
        return

    }


    const getClusterList = (userSelectedBlock?: any) => {
        console.log(userSelectedBlock, "inside get block")


        if (!districtData) {
            return [];
        }
        if (!userSelectedBlock) {
            let res = _.uniqBy(
                districtData,
                "cluster"
            ).map((a: any) => {
                return {
                    id: a.cluster,
                    name: a.cluster,
                };
            });

            if (res) setClusters(res)
            return
        }
        let res = _.uniqBy(
            districtData.filter((d: any) => d.block === userSelectedBlock),
            "cluster"
        ).map((a: any) => {
            return {
                id: a.cluster,
                name: a.cluster,
            };
        });

        setClusters(res)
        return

    }


    const handleValueChange = useCallback(() => {
        getDistrictList()
        getBlockList()
        getClusterList()
    }, [districtData])


    useEffect(() => {
        handleValueChange()
    }, [handleValueChange])


    if (districts && blocks && clusters) {
        return [[districts, getDistrictList], [blocks, getBlockList], [clusters, getClusterList]]
    }

    return [[], [], []]
}
