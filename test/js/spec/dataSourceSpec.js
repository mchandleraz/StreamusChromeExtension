﻿define([
    'dataSource',
    'dataSourceType'
], function (DataSource, DataSourceType) {
    'use strict';

    describe('DataSource', function () {

        var expectDataSource = function (source, expectations) {
            //  Allow for expectations to be optional.
            expectations = expectations || {};

            expect(source.get('sourceId')).toEqual(expectations.sourceId === undefined ? source.defaults.sourceId : expectations.sourceId);
            expect(source.get('type')).toEqual(expectations.type === undefined ? source.defaults.type : expectations.type);
            expect(source.get('url')).toEqual(expectations.url === undefined ? source.defaults.url : expectations.url);
        };
        
        it('Should initialize properly', function () {
            expectDataSource(new DataSource());
        });

        it('Should be able to parse YouTube Playlist URLs', function() {
            var dataSource;

            dataSource = new DataSource({ urlToParse: 'http://www.youtube.com/playlist?list=PL63F0C78739B09958' });
            expectDataSource(dataSource, {
                sourceId: '63F0C78739B09958',
                type: DataSourceType.YouTubePlaylist,
                url: 'https://gdata.youtube.com/feeds/api/playlists/63F0C78739B09958'
            });

            dataSource = new DataSource({ urlToParse: 'http://www.youtube.com/playlist?p=PL63F0C78739B09958' });
            expectDataSource(dataSource, {
                sourceId: '63F0C78739B09958',
                type: DataSourceType.YouTubePlaylist,
                url: 'https://gdata.youtube.com/feeds/api/playlists/63F0C78739B09958'
            });
        });

        it('Should be able to parse YouTube Favorites URLs', function() {
            var dataSource;

            dataSource = new DataSource({ urlToParse: 'http://www.youtube.com/playlist?list=FL-SyDtP6JOvHZVcRrZrXnyA' });
            expectDataSource(dataSource, {
                sourceId: '-SyDtP6JOvHZVcRrZrXnyA',
                type: DataSourceType.YouTubeFavorites,
                url: 'https://gdata.youtube.com/feeds/api/users/-SyDtP6JOvHZVcRrZrXnyA/favorites'
            });

            dataSource = new DataSource({ urlToParse: 'http://www.youtube.com/playlist?p=FL-SyDtP6JOvHZVcRrZrXnyA' });
            expectDataSource(dataSource, {
                sourceId: '-SyDtP6JOvHZVcRrZrXnyA',
                type: DataSourceType.YouTubeFavorites,
                url: 'https://gdata.youtube.com/feeds/api/users/-SyDtP6JOvHZVcRrZrXnyA/favorites'
            });

        });

        it('Should be able to parse YouTube Channel URLs', function() {
            var dataSource;

            //  A variety of URLs work when identifying a YouTube channel:
            dataSource = new DataSource({ urlToParse: 'http://www.youtube.com/channel/UCXIyz409s7bNWVcM-vjfdVA' });
            expectDataSource(dataSource, {
                sourceId: 'UCXIyz409s7bNWVcM-vjfdVA',
                type: DataSourceType.YouTubeChannel,
                url: 'https://gdata.youtube.com/feeds/api/users/UCXIyz409s7bNWVcM-vjfdVA/uploads'
            });

            dataSource = new DataSource({ urlToParse: 'http://www.youtube.com/user/majesticcasual' });
            expectDataSource(dataSource, {
                sourceId: 'majesticcasual',
                type: DataSourceType.YouTubeChannel,
                url: 'https://gdata.youtube.com/feeds/api/users/majesticcasual/uploads'
            });
  
            dataSource = new DataSource({ urlToParse: 'http://www.youtube.com/playlist?list=UU-e1BqfubuSdFPHauQwZmlg' });
            expectDataSource(dataSource, {
                sourceId: '-e1BqfubuSdFPHauQwZmlg',
                type: DataSourceType.YouTubeChannel,
                url: 'https://gdata.youtube.com/feeds/api/users/-e1BqfubuSdFPHauQwZmlg/uploads'
            });

            dataSource = new DataSource({ urlToParse: 'http://www.youtube.com/playlist?p=UU-e1BqfubuSdFPHauQwZmlg' });
            expectDataSource(dataSource, {
                sourceId: '-e1BqfubuSdFPHauQwZmlg',
                type: DataSourceType.YouTubeChannel,
                url: 'https://gdata.youtube.com/feeds/api/users/-e1BqfubuSdFPHauQwZmlg/uploads'
            });
        });

        it('Should be able to parse YouTube Auto-Generated Playlist URLs', function() {
            var dataSource;
            
            //  TODO: Support URL property for auto-generate source type?
            //  V3 API expects the full ID paramater while V2 does not expect the leading identifier.
            dataSource = new DataSource({ urlToParse: 'http://www.youtube.com/playlist?p=ALYL4kY05133rTMhTulSaXKj_Y6el9q0JH' });
            expectDataSource(dataSource, {
                sourceId: 'ALYL4kY05133rTMhTulSaXKj_Y6el9q0JH',
                type: DataSourceType.YouTubeAutoGenerated
            });

            dataSource = new DataSource({ urlToParse: 'http://www.youtube.com/playlist?list=ALYL4kY05133rTMhTulSaXKj_Y6el9q0JH' });
            expectDataSource(dataSource, {
                sourceId: 'ALYL4kY05133rTMhTulSaXKj_Y6el9q0JH',
                type: DataSourceType.YouTubeAutoGenerated
            });

        });
        
        //  TODO: Support Shared_Playlist again.
        xit('Should be able to parse Streamus Shared Playlist URLs', function () {

            //var dataSource;
            
            //dataSource = new DataSource({ urlToParse: 'streamus:' });
            //expectDataSource(dataSource, {
            //    sourceId: '',
            //    type: DataSourceType.SharedPlaylist
            //});

        });

        xit('Should have a properly working success callback for getTitle', function() {
            var successCalled = false;
            var dataSource = new DataSource({ urlToParse: 'http://www.youtube.com/playlist?list=PL63F0C78739B09958' });

            runs(function () {
                dataSource.getTitle({
                    success: function () {
                        successCalled = true;
                    }
                });
            });

            waitsFor(function () {
                return successCalled;
            }, 'DataSource should have called success', 2000 );
        });

        it('Should have a properly working error callback for getTitle', function() {
            var errorCalled = false;
            var dataSource = new DataSource({ urlToParse: 'http://www.youtube.com/playlist?list=sdfsdfsdfsdfsdf' });
            runs(function () {
                dataSource.getTitle({
                    notifyOnError: false,
                    error: function () {
                        errorCalled = true;
                    }
                });
            });

            waitsFor(function () {
                return errorCalled;
            }, 'DataSource should have called error', 2000);
        });

        it('Should be able to get a youtube playlist title', function() {

            var dataSource = new DataSource({ urlToParse: 'http://www.youtube.com/playlist?list=PL63F0C78739B09958' });

            runs(function() {
                dataSource.getTitle();
            });

            waitsFor(function() {
                return dataSource.get('title') !== '';
            }, 'DataSource should have retrieved its title', 1000);

            runs(function () {
                expect(dataSource.get('title')).toEqual('Music Playlist');
            });
        });
        
        it('Should be able to get a youtube channel name', function () {

            var dataSource = new DataSource({ urlToParse: 'http://www.youtube.com/channel/UCXIyz409s7bNWVcM-vjfdVA' });

            runs(function () {
                dataSource.getTitle();
            });

            waitsFor(function () {
                return dataSource.get('title') !== '';
            },  'DataSource should have retrieved its title', 2000);

            runs(function () {
                expect(dataSource.get('title')).toEqual('Majestic Casual');
            });
        });

        it('Should be able to get a YouTube auto-generated playlist title', function () {

            var dataSource = new DataSource({ urlToParse: 'http://www.youtube.com/playlist?p=ALYL4kY05133rTMhTulSaXKj_Y6el9q0JH' });

            runs(function () {
                dataSource.getTitle();
            });

            waitsFor(function () {
                return dataSource.get('title') !== '';
            }, 'DataSource should have retrieved its title', 2000);

            runs(function () {
                expect(dataSource.get('title')).toEqual('Top Tracks for Kendrick Lamar');
            });
        });

        it('Should be able to successfully indicate whether it is a V3 YouTube API source', function() {
            var dataSource;
            
            dataSource = new DataSource({ type: DataSourceType.YouTubeAutoGenerated });
            expect(dataSource.isV3()).toEqual(true);
            
            dataSource = new DataSource({ type: DataSourceType.YouTubeChannel });
            expect(dataSource.isV3()).toEqual(false);
        });
        
        it('Should be able to successfully indicate whether it needsLoading', function () {
            var dataSource;

            dataSource = new DataSource({ type: DataSourceType.YouTubeChannel });
            expect(dataSource.needsLoading()).toEqual(true);
            
            dataSource = new DataSource({ type: DataSourceType.YouTubePlaylist });
            expect(dataSource.needsLoading()).toEqual(true);
            
            dataSource = new DataSource({ type: DataSourceType.YouTubeFavorites });
            expect(dataSource.needsLoading()).toEqual(true);
            
            dataSource = new DataSource({ type: DataSourceType.YouTubeAutoGenerated });
            expect(dataSource.needsLoading()).toEqual(true);
            
            dataSource = new DataSource({ type: DataSourceType.None });
            expect(dataSource.needsLoading()).toEqual(false);

            dataSource = new DataSource({ type: DataSourceType.Unknown });
            expect(dataSource.needsLoading()).toEqual(false);
            
            dataSource = new DataSource({ type: DataSourceType.SharedPlaylist });
            expect(dataSource.needsLoading()).toEqual(false);
            
            dataSource = new DataSource({ type: DataSourceType.UserInput });
            expect(dataSource.needsLoading()).toEqual(false);
        });

        it('Should be able to parse a YouTube video id from a variety of URL patterns', function () {
            expect((new DataSource()).parseYouTubeVideoIdFromUrl('http://www.youtube.com/watch?v=6od4WeaWDcs')).toEqual('6od4WeaWDcs');
            expect((new DataSource()).parseYouTubeVideoIdFromUrl('http://youtu.be/3sg6KCayu0E')).toEqual('3sg6KCayu0E');
            expect((new DataSource()).parseYouTubeVideoIdFromUrl('http://www.youtube.com/watch?feature=youtu.be&v=aKpLrmQsS_M')).toEqual('aKpLrmQsS_M');
            expect((new DataSource()).parseYouTubeVideoIdFromUrl('http://www.youtube.com/watch?feature=player_embedded&v=MKS8Jn_3bnA')).toEqual('MKS8Jn_3bnA');
            //  10 digit URL is not valid:
            expect((new DataSource()).parseYouTubeVideoIdFromUrl('http://youtu.be/3sg6KCau0E')).toEqual(null);
            //  12 digit URL is not valid
            expect((new DataSource()).parseYouTubeVideoIdFromUrl('http://youtu.be/3sg6KaaCau0E')).toEqual(null);
        });

    });

});

