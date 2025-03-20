<script lang="ts">

</script>

<style lang="sass">
    @use "./tab-timer.sass"
</style>

<div class="tab-timer">
    <div class="timer-zone">
        <p>Active tab time since last notification</p>
        <div class="timer">
            3:12
        </div>
    </div>
    <div class="timer-zone">
        <p>Total active tab time</p>
        <div class="timer">
            7:12
        </div>
    </div>
    <div class="mini-stats">
        <div class="mini-stat">
            <p class="title">Notifications dismissed</p>
            <p class="value">3</p>
        </div>
        <div class="mini-stat">
            <p class="title">Total tab lifetime</p>
            <p class="value">10:33</p>
        </div>
    </div>

    <div class="button-zone">
        <p><a href="">Dismiss</a></p>
        <p><a href="">Dismiss forever</a></p>
    </div>
</div>